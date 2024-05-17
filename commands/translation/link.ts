import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import { createCommand } from '../../types/DiscordCommand';
import translateChannels from '../../cache/translateChannels';
import channelLinks from '../../cache/channelLinks';
import { IChannelLink } from '../../models/ChannelLink';
import { ITranslateChannel } from '../../models/TranslateChannel';

const LinkOptions = {
  SOURCE_CHANNEL: 'source-channel',
  TARGET_CHANNEL: 'target-channel',
  MODE: 'mode',
  mode: {
    UNIDIRECTIONAL: 'unidirectional',
    BIDIRECTIONAL: 'bidirectional',
    RECURSIVE: 'recursive',
  },
};

const data = new SlashCommandBuilder()
  .setName('link')
  .setDescription('Links two translation channels.')
  .addChannelOption((option) =>
    option
      .setName(LinkOptions.TARGET_CHANNEL)
      .setDescription('The target channel to link.')
      .setRequired(true)
  )
  .addChannelOption((option) =>
    option
      .setName(LinkOptions.SOURCE_CHANNEL)
      .setDescription(
        'The source channel to link. If not provided, takes the current channel as the source.'
      )
  )
  .addStringOption((option) =>
    option
      .setName(LinkOptions.MODE)
      .setDescription('Specify linking mode. Default is bidirectional.')
      .addChoices(
        {
          name: LinkOptions.mode.UNIDIRECTIONAL,
          value: LinkOptions.mode.UNIDIRECTIONAL,
        },
        {
          name: LinkOptions.mode.BIDIRECTIONAL,
          value: LinkOptions.mode.BIDIRECTIONAL,
        },
        {
          name: LinkOptions.mode.RECURSIVE,
          value: LinkOptions.mode.RECURSIVE,
        }
      )
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export const getChLink = async (channelId: string, guildId: string) => {
  return (
    (await channelLinks.get(channelId)) ??
    (await channelLinks.create(channelId, guildId))
  );
};

export const linkChannel = async (
  channelLink: IChannelLink,
  channelId: string,
  translateChannel: ITranslateChannel
) => {
  if (channelLink.links.find((link) => link.id === channelId) === undefined) {
    channelLink.links.push(translateChannel);
    await channelLinks.update(channelLink);
    return true;
  }
  return false;
};

export interface IChProcessMapValue {
  chLink: IChannelLink;
  trChannel: ITranslateChannel;
}

export const linkChannelNoDB = (
  channelLink: IChannelLink,
  channelId: string,
  translateChannel: ITranslateChannel
) => {
  if (channelLink.links.find((link) => link.id === channelId) === undefined) {
    channelLink.links.push(translateChannel);
    return true;
  }
  return false;
};

export const linkChannels = async (
  processMap: Map<string, IChProcessMapValue>
) => {
  let linked = false;
  processMap.forEach(({ chLink: sourceChLink }) => {
    processMap.forEach(
      ({ chLink: targetChLink, trChannel: targetTrChannel }) => {
        if (sourceChLink === targetChLink) return;

        linked =
          linkChannelNoDB(sourceChLink, targetChLink.id, targetTrChannel) ||
          linked;
      }
    );
  });

  // save to db
  const promises: Promise<void>[] = [];
  processMap.forEach(({ chLink }) => {
    promises.push(
      (async () => {
        await channelLinks.update(chLink);
      })()
    );
  });
  await Promise.all(promises);

  return linked;
};

const execute = async (interaction: ChatInputCommandInteraction) => {
  if (!interaction.guildId) {
    await interaction.reply({
      content: `This command is only available on servers.`,
    });
    return;
  }

  const sourceChannelId =
    interaction.options.getChannel(LinkOptions.SOURCE_CHANNEL)?.id ??
    interaction.channelId;

  const targetChannelId = interaction.options.getChannel(
    LinkOptions.TARGET_CHANNEL
  )?.id;
  if (!targetChannelId) {
    await interaction.reply({
      content: `Please specify the target channel.`,
    });
    return;
  }

  const mode =
    interaction.options.getString(LinkOptions.MODE) ??
    LinkOptions.mode.BIDIRECTIONAL;

  // check if these channels have languages associated with them
  const [sourceTrChannel, targetTrChannel] = await Promise.all([
    translateChannels.get(sourceChannelId),
    translateChannels.get(targetChannelId),
  ]);

  let errorMessage = '';
  if (sourceChannelId === targetChannelId) {
    errorMessage = `You cannot link <#${sourceChannelId}> with itself!`;
  } else if (sourceTrChannel == null && targetTrChannel == null) {
    errorMessage = `Both <#${sourceChannelId}> and <#${targetChannelId}> are not associated with any languages yet. Please use the \`/set\` command to set their languages.`;
  } else if (sourceTrChannel == null) {
    errorMessage = `<#${sourceChannelId}> is not associated with any languages yet. Please use the \`/set\` command to set its language.`;
  } else if (targetTrChannel == null) {
    errorMessage = `<#${targetChannelId}> is not associated with any languages yet. Please use the \`/set\` command to set its language.`;
  }

  if (errorMessage || sourceTrChannel == null || targetTrChannel == null) {
    await interaction.reply({
      content: errorMessage,
    });
    return;
  }

  // add to their respective link documents
  const [sourceChLink, targetChLink] = await Promise.all([
    getChLink(sourceChannelId, interaction.guildId),
    getChLink(targetChannelId, interaction.guildId),
  ]);

  let linked = false;

  // link unidirectional
  linked = await linkChannel(sourceChLink, targetChannelId, targetTrChannel);
  if (mode === LinkOptions.mode.UNIDIRECTIONAL) {
    await interaction.reply({
      content: linked
        ? `<#${sourceChannelId}> **(${sourceTrChannel.sourceLang})** is now linked **unidirectionally** to <#${targetChannelId}> **(${targetTrChannel.sourceLang})**!`
        : `<#${sourceChannelId}> **(${sourceTrChannel.sourceLang})** is already linked with <#${targetChannelId}> **(${targetTrChannel.sourceLang})**!`,
    });
    return;
  }

  // link bidirectional
  linked =
    (await linkChannel(targetChLink, sourceChannelId, sourceTrChannel)) ||
    linked;
  if (mode === LinkOptions.mode.BIDIRECTIONAL) {
    await interaction.reply({
      content: linked
        ? `<#${sourceChannelId}> **(${sourceTrChannel.sourceLang})** and <#${targetChannelId}> **(${targetTrChannel.sourceLang})** are now linked!`
        : `<#${sourceChannelId}> **(${sourceTrChannel.sourceLang})** and <#${targetChannelId}> **(${targetTrChannel.sourceLang})** are already linked!`,
    });
    return;
  }

  // link recursive
  const jobQueue = [sourceChLink, targetChLink];
  const toProcessMap = new Map<string, IChProcessMapValue>();

  // already add these to map to save time
  toProcessMap.set(sourceChLink.id, {
    chLink: sourceChLink,
    trChannel: sourceTrChannel,
  });
  toProcessMap.set(targetChLink.id, {
    chLink: targetChLink,
    trChannel: targetTrChannel,
  });

  // build map containing all channels
  while (jobQueue.length) {
    const chLink = jobQueue.shift()!;

    for (const link of chLink.links) {
      if (toProcessMap.get(link.id)) continue;

      const [linkTrChannel, linkChLink] = await Promise.all([
        translateChannels.get(link.id),
        getChLink(link.id, interaction.guildId),
      ]);
      jobQueue.push(linkChLink);

      if (!linkTrChannel) continue;

      toProcessMap.set(linkChLink.id, {
        chLink: linkChLink,
        trChannel: linkTrChannel,
      });
    }
  }

  // start linking recursively O(n^2) [actually O(n^3) because of linkChannel()]
  linked = (await linkChannels(toProcessMap)) || linked;

  await interaction.reply({
    content: linked
      ? `<#${sourceChannelId}> **(${sourceTrChannel.sourceLang})** and <#${targetChannelId}> **(${targetTrChannel.sourceLang})** are now linked **recursively**!`
      : `<#${sourceChannelId}> **(${sourceTrChannel.sourceLang})** and <#${targetChannelId}> **(${targetTrChannel.sourceLang})** are already linked **recursively**!`,
  });
};

export default createCommand({
  data,
  execute,
});

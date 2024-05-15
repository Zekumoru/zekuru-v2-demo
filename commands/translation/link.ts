import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import { createCommand } from '../../types/DiscordCommand';
import translateChannels from '../../cache/translateChannels';
import channelLinks from '../../cache/channelLinks';

const LinkOptions = {
  SOURCE_CHANNEL: 'source-channel',
  TARGET_CHANNEL: 'target-channel',
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
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

const execute = async (interaction: ChatInputCommandInteraction) => {
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
    errorMessage = `<#${sourceChannelId}> it not associated with any languages yet. Please use the \`/set\` command to set its language.`;
  } else if (targetTrChannel == null) {
    errorMessage = `<#${targetChannelId}> it not associated with any languages yet. Please use the \`/set\` command to set its language.`;
  }

  if (errorMessage || sourceTrChannel == null || targetTrChannel == null) {
    await interaction.reply({
      content: errorMessage,
    });
    return;
  }

  // add to their respective link documents
  const sourceChLink =
    (await channelLinks.get(sourceChannelId)) ??
    (await channelLinks.create(sourceChannelId));
  const targetChLink =
    (await channelLinks.get(targetChannelId)) ??
    (await channelLinks.create(targetChannelId));

  // see if already added, otherwise add
  if (
    sourceChLink.links.find((link) => link.id === targetChannelId) === undefined
  ) {
    sourceChLink.links.push(targetTrChannel);
    channelLinks.update(sourceChLink);
  }

  if (
    targetChLink.links.find((link) => link.id === sourceChannelId) === undefined
  ) {
    targetChLink.links.push(sourceTrChannel);
    channelLinks.update(targetChLink);
  }

  await interaction.reply({
    content: `<#${sourceChannelId}> **(${sourceTrChannel.sourceLang})** and <#${targetChannelId}> **(${targetTrChannel.sourceLang})** are now linked!`,
  });
};

export default createCommand({
  data,
  execute,
});

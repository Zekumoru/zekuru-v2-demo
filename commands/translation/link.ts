import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { createCommand } from '../../types/DiscordCommand';
import translateChannels from '../../cache/translateChannels';
import channelLinks from '../../cache/channelLinks';

const data = new SlashCommandBuilder()
  .setName('link')
  .setDescription('Links two translation channels.')
  .addChannelOption((option) =>
    option
      .setName('first-channel')
      .setDescription('The first of the two channels to link.')
      .setRequired(true)
  )
  .addChannelOption((option) =>
    option
      .setName('second-channel')
      .setDescription('The second of the two channels to link.')
      .setRequired(true)
  );

const execute = async (interaction: ChatInputCommandInteraction) => {
  const firstChannel = interaction.options.getChannel('first-channel');
  if (!firstChannel) {
    await interaction.reply({
      content: `Please specify the first channel.`,
      ephemeral: true,
    });
    return;
  }

  const secondChannel = interaction.options.getChannel('second-channel');
  if (!secondChannel) {
    await interaction.reply({
      content: `Please specify the second channel.`,
      ephemeral: true,
    });
    return;
  }

  // check if these channels have languages associated with them
  const [firstTrChannel, secondTrChannel] = await Promise.all([
    translateChannels.get(firstChannel.id),
    translateChannels.get(secondChannel.id),
  ]);

  let errorMessage = '';
  if (firstChannel.id === secondChannel.id) {
    errorMessage = `You cannot link <#${firstChannel.id}> with itself!`;
  } else if (firstTrChannel == null && secondTrChannel == null) {
    errorMessage = `Both <#${firstChannel.id}> and <#${secondChannel.id}> are not associated with any languages yet. Please use the \`/set\` command to set their languages.`;
  } else if (firstTrChannel == null) {
    errorMessage = `<#${firstChannel.id}> it not associated with any languages yet. Please use the \`/set\` command to set its language.`;
  } else if (secondTrChannel == null) {
    errorMessage = `<#${secondChannel.id}> it not associated with any languages yet. Please use the \`/set\` command to set its language.`;
  }

  if (errorMessage || firstTrChannel == null || secondTrChannel == null) {
    await interaction.reply({
      content: errorMessage,
      ephemeral: true,
    });
    return;
  }

  // add to their respective link documents
  const firstLink =
    (await channelLinks.get(firstChannel.id)) ??
    (await channelLinks.create(firstChannel.id));
  const secondLink =
    (await channelLinks.get(secondChannel.id)) ??
    (await channelLinks.create(secondChannel.id));

  // see if already added, otherwise add
  if (
    firstLink.links.find((link) => link.id === secondChannel.id) === undefined
  ) {
    firstLink.links.push(secondTrChannel);
    channelLinks.update(firstLink);
  }

  if (
    secondLink.links.find((link) => link.id === firstChannel.id) === undefined
  ) {
    secondLink.links.push(firstTrChannel);
    channelLinks.update(secondLink);
  }

  await interaction.reply({
    content: `<#${firstChannel.id}> (${firstTrChannel.sourceLang}) and <#${secondChannel.id}> (${secondTrChannel.sourceLang}) are now linked!`,
    ephemeral: true,
  });
};

export default createCommand({
  data,
  execute,
});

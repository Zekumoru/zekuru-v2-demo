import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { createCommand } from '../../types/DiscordCommand';
import { sourceLanguages, targetLanguages } from '../../translation/translator';
import translateChannels from '../../cache/translateChannels';

const data = new SlashCommandBuilder()
  .setName('set')
  .setDescription(`Set a channel's language.`)
  .addStringOption((option) =>
    option
      .setName('language')
      .setDescription('The language to set.')
      .setAutocomplete(true)
      .setRequired(true)
  )
  .addChannelOption((option) =>
    option
      .setName('channel')
      .setDescription('The channel to set the language of.')
      .setRequired(false)
  );

const autocomplete = async (interaction: AutocompleteInteraction) => {
  const focusedValue = interaction.options.getFocused();
  const choices = sourceLanguages.map((lang) => lang.name);
  const filtered = choices
    .filter((choice) => choice.startsWith(focusedValue))
    .slice(0, 25);

  await interaction.respond(
    filtered.map((choice) => ({ name: choice, value: choice }))
  );
};

const execute = async (interaction: ChatInputCommandInteraction) => {
  const channelId =
    interaction.options.getChannel('channel')?.id ?? interaction.channelId;

  const language = interaction.options.getString('language');
  if (!language) {
    await interaction.reply({
      content: `Please specify a language.`,
      ephemeral: true,
    });
    return;
  }

  const sourceLang = sourceLanguages.find((lang) =>
    lang.name.includes(language)
  )?.code;
  if (!sourceLang) {
    await interaction.reply({
      content: `Invalid language '${language}'.`,
      ephemeral: true,
    });
    return;
  }

  const targetLang = targetLanguages.find((lang) =>
    lang.name.includes(language)
  )?.code;
  if (!targetLang) {
    await interaction.reply({
      content: `Error! Target language is missing. Please contact the developer.`,
      ephemeral: true,
    });
    return;
  }

  await translateChannels.set(channelId, sourceLang, targetLang);

  await interaction.reply({
    content: `<#${channelId}> has been set to '${language}'.`,
    ephemeral: true,
  });
};

export default createCommand({
  data,
  autocomplete,
  execute,
});

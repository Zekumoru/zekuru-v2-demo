import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { createCommand } from '../../types/DiscordCommand';
import { sourceLanguages } from '../../translation/translator';

const data = new SlashCommandBuilder()
  .setName('set')
  .setDescription(`Set a channel's language.`)
  .addChannelOption((option) =>
    option
      .setName('channel')
      .setDescription('The channel to set the language of.')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('language')
      .setDescription('The language to set.')
      .setAutocomplete(true)
      .setRequired(true)
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
  await interaction.reply({
    content: 'In development',
    ephemeral: true,
  });
};

export default createCommand({
  data,
  autocomplete,
  execute,
});

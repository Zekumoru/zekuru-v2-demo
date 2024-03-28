import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('shewi')
  .setDescription('Cute Shewi?');

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.reply('Shewi is super kawaii! >~<');
};

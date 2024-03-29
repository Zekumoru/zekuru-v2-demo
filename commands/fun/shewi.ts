import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { createCommand } from '../../types/DiscordCommand';

const data = new SlashCommandBuilder()
  .setName('shewi')
  .setDescription('Cute Shewi?');

const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.reply('Shewi is super kawaii! >~<');
};

export default createCommand({
  cooldown: 5,
  data,
  execute,
});

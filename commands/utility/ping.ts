import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { createCommand } from '../../types/DiscordCommand';

const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!');

const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.reply('Pong!');
};

export default createCommand({
  cooldown: 5,
  data,
  execute,
});

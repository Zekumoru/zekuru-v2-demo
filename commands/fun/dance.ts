import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { createCommand } from '../../types/DiscordCommand';

const data = new SlashCommandBuilder()
  .setName('shewi-theme-song')
  .setDescription('Be drowned in cuteness!!');

const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.reply('https://youtu.be/G5FbA8Ap430?si=GWQ2asUae7vdC5WV');
};

export default createCommand({
  cooldown: 5,
  data,
  execute,
});

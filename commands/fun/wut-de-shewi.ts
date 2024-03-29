import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { createCommand } from '../../types/DiscordCommand';

const data = new SlashCommandBuilder()
  .setName('wut-de-shewi')
  .setDescription('Ehhhhhh?!?!!');

const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.reply('# Wut De Shewiiiiiiiiiiii!!');
};

export default createCommand({
  cooldown: 5,
  data,
  execute,
});

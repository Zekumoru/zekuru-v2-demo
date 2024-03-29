import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { createCommand } from '../../types/DiscordCommand';

const data = new SlashCommandBuilder()
  .setName('server')
  .setDescription('Provides information about the server.');

const execute = async (interaction: ChatInputCommandInteraction) => {
  if (!interaction.guild) {
    await interaction.reply('Could not get server information.');
    return;
  }

  // interaction.guild is the object representing the Guild in which the command was run
  await interaction.reply(
    `This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`
  );
};

export default createCommand({
  cooldown: 5,
  data,
  execute,
});

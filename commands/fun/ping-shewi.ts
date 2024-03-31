import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { createCommand } from '../../types/DiscordCommand';

const data = new SlashCommandBuilder()
  .setName('ping-shewi')
  .setDescription('Where\'s Shewi?!?!!');

const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.reply('<@285868960375635969>');
};

export default createCommand({
  cooldown: 1,
  data,
  execute,
});

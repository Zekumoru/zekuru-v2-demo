import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { createCommand } from '../../types/DiscordCommand';

const data = new SlashCommandBuilder()
  .setName('wut-de-shewi')
  .setDescription('Ehhhhhh?!?!!');

const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.reply('# Wut De Shewiiiiiiiiiiii!!')
  await interaction.channel?.send('https://cdn.discordapp.com/attachments/987752925688389675/1223925077377028106/Wut_Dehellpng.png?ex=661ba00d&is=66092b0d&hm=a563b63e8e1d2d69edcbc4c39c7a1d7b1db64c7de9ab846d092606bd1759a648&')
};

export default createCommand({
  cooldown: 0,
  data,
  execute,
});

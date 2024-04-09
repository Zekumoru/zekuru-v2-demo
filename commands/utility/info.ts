import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { createCommand } from '../../types/DiscordCommand';

const data = new SlashCommandBuilder()
  .setName('info')
  .setDescription('Get info about a user or a server!')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('user')
      .setDescription('Info about a user.')
      .addUserOption((option) =>
        option.setName('target').setDescription('The user')
      )
  )
  .addSubcommand((subcommand) =>
    subcommand.setName('server').setDescription('Info about the server')
  );

const execute = async (interaction: ChatInputCommandInteraction) => {
  if (interaction.options.getSubcommand() === 'user') {
    const user = interaction.options.getUser('target');

    if (user)
      await interaction.reply(`Username: ${user.username}\nID: ${user.id}`);
    else
      await interaction.reply(
        `Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`
      );
    return;
  }

  if (interaction.options.getSubcommand() === 'server') {
    if (!interaction.guild) {
      await interaction.reply(
        'An error occurred. Could not get server information.'
      );
      return;
    }
    await interaction.reply(
      `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
    );
  }
};

export default createCommand({
  cooldown: 5,
  data,
  execute,
});

import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js';
import { createCommand } from '../../types/DiscordCommand';

const data = new SlashCommandBuilder()
  .setName('user')
  .setDescription('Provides information about the user.');

const execute = async (interaction: ChatInputCommandInteraction) => {
  // interaction.user is the object representing the User who ran the command
  // interaction.member is the GuildMember object, which represents the user in the specific guild
  await interaction.reply(
    `This command was run by ${interaction.user.username}, who joined on ${
      (interaction.member as GuildMember).joinedAt
    }.`
  );
};

export default createCommand({
  cooldown: 5,
  data,
  execute,
});

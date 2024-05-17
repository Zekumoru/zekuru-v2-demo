import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import { createCommand } from '../../types/DiscordCommand';
import translatorCache from '../../cache/translatorCache';

const data = new SlashCommandBuilder()
  .setName('sign-out')
  .setDescription(
    `Signs out the bot removing the api key from the bot's server.`
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

const execute = async (interaction: ChatInputCommandInteraction) => {
  if (!interaction.guildId) {
    await interaction.reply({
      content: `This command is only available on servers.`,
    });
    return;
  }

  // if not signed in
  const translator = await translatorCache.get(interaction.guildId);
  if (translator == null) {
    await interaction.reply({
      content: `You are already signed out.`,
    });
    return;
  }

  await translatorCache.unset(interaction.guildId);
  await interaction.reply({
    content: `Bot has successfully signed out.`,
  });
};

export default createCommand({
  data,
  execute,
});

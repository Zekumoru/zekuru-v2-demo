import { CacheType, Events, Interaction } from 'discord.js';
import { DiscordEvent } from '../types/DiscordEvent';

export default {
  name: Events.InteractionCreate,
  execute: async (interaction: Interaction<CacheType>) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);

      const errorMessageContent = {
        content: 'There was an error while executing this command!',
        ephemeral: true,
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessageContent);
      } else {
        await interaction.reply(errorMessageContent);
      }
    }
  },
} as DiscordEvent;

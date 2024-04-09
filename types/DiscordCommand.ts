import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';

export interface DiscordCommand {
  cooldown?: number;
  devOnly?: boolean;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
  data:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const createCommand = (command: DiscordCommand): DiscordCommand =>
  command;

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface DiscordCommand {
  cooldown?: number;
  devOnly?: boolean;
  data:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const createCommand = (command: DiscordCommand): DiscordCommand =>
  command;

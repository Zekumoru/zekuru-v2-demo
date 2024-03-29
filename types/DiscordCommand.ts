import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface DiscordCommand {
  cooldown?: number;
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const createCommand = (command: DiscordCommand): DiscordCommand =>
  command;

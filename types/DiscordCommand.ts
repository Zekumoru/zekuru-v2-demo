import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface DiscordCommand {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

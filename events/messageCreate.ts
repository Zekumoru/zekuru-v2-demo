import { Events, Message } from 'discord.js';
import { DiscordEvent } from '../types/DiscordEvent';

const devGuildId = process.env.GUILD_ID!;

export default {
  name: Events.MessageCreate,
  execute: async (message: Message) => {
    // only process this event if in the dev guild
    if (message.guildId !== devGuildId) return;
    // if it is a bot, ignore
    if (message.author.bot) return;

    await message.reply(message.content);
  },
} as DiscordEvent;

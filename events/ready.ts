import { Client, Events } from 'discord.js';
import { DiscordEvent } from '../types/DiscordEvent';
import { appDebug } from '../utils/logger';

export default {
  name: Events.ClientReady,
  once: true,
  execute: (client: Client<true>) => {
    appDebug(`Ready! Logged in as ${client.user.tag}.`);
  },
} as DiscordEvent;

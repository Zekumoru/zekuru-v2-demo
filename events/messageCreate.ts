import {
  ChannelType,
  DiscordAPIError,
  EmbedBuilder,
  Events,
  Message,
} from 'discord.js';
import { DiscordEvent } from '../types/DiscordEvent';
import webhookCache from '../cache/webhookCache';
import { errorDebug } from '../utils/logger';

export default {
  name: Events.MessageCreate,
  execute: async (message: Message) => {
    if (message.author.bot) return;
    if (message.channelId !== '983305448151191552') return; // Dev Server's test channel

    const channel = message.guild?.channels.cache.get(message.channelId);
    if (!channel) return;
    if (channel.type !== ChannelType.GuildText) return;

    const webhook = await webhookCache.get(channel);
    // const embed = new EmbedBuilder()
    //   .setColor(0x0099ff)
    //   .setAuthor({
    //     name: message.member?.nickname ?? message.author.displayName,
    //     iconURL:
    //       message.member?.avatarURL({ size: 32 }) ??
    //       message.author.displayAvatarURL({ size: 32 }),
    //   })
    //   .setDescription(`Edit maybe?`);
    try {
      await webhook.deleteMessage('1241129650424643595');
    } catch (error) {
      errorDebug(error);
    }
    // const embed = new EmbedBuilder()
    //   .setColor(0x0099ff)
    //   .setAuthor({
    //     name: message.member?.nickname ?? message.author.displayName,
    //     iconURL:
    //       message.member?.avatarURL({ size: 32 }) ??
    //       message.author.displayAvatarURL({ size: 32 }),
    //   })
    //   .setDescription(`<@${message.author.id}>`);

    // webhook.send({
    //   username: message.member?.displayName ?? message.author.displayName,
    //   avatarURL:
    //     message.member?.avatarURL() ?? message.author.avatarURL() ?? undefined,
    //   content: `Are you pinged?`,
    //   embeds: [embed],
    // });
  },
} as DiscordEvent;

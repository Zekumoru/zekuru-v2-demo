import { ChannelType, EmbedBuilder, Events, Message } from 'discord.js';
import { DiscordEvent } from '../types/DiscordEvent';
import webhookCache from '../cache/webhookCache';

export default {
  name: Events.MessageCreate,
  execute: async (message: Message) => {
    if (message.author.bot) return;
    if (message.channelId !== '983305448151191552') return; // Dev Server's test channel

    const channel = message.guild?.channels.cache.get(message.channelId);
    if (!channel) return;
    if (channel.type !== ChannelType.GuildText) return;

    if (!message.reference) return;

    const replyMessage = await message.fetchReference();
    if (!replyMessage) return;

    let replyContentRaw = replyMessage.content;
    if (replyContentRaw.length > 77)
      replyContentRaw = `${replyContentRaw.slice(0, 77)}...`;
    let replyContent = `**[Replying to:](${replyMessage.url})** ${replyContentRaw}`;

    if (replyContentRaw === '') {
      // check if replying to an attachment
      if (replyMessage.attachments.size) {
        replyContent = `**[Replying to an attachment](${replyMessage.url})** ${replyContentRaw}`;
      } else if (replyMessage.stickers.size) {
        replyContent = `**[Replying to a sticker](${replyMessage.url})**`;
      } else {
        // maybe will change in the future?
        // idk what other attachments there are other than embeds
        replyContent = `**[Replying to an attachment](${replyMessage.url})** ${replyContentRaw}`;
      }
    }

    const replyChannel = message.guild?.channels.cache.get(
      replyMessage.channelId
    );
    if (!replyChannel) return;
    if (replyChannel.type !== ChannelType.GuildText) return;

    const webhook = await webhookCache.get(channel);
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setAuthor({
        name: message.member?.nickname ?? message.author.displayName,
        iconURL:
          message.member?.avatarURL({ size: 32 }) ??
          message.author.displayAvatarURL({ size: 32 }),
      })
      .setDescription(replyContent)
      .setFooter({
        text: `#${replyChannel.name}`,
      });

    webhook.send({
      username: message.member?.displayName ?? message.author.displayName,
      avatarURL:
        message.member?.avatarURL() ?? message.author.avatarURL() ?? undefined,
      embeds: [embed],
    });
  },
} as DiscordEvent;

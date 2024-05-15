import {
  ChannelType,
  EmbedBuilder,
  Events,
  Message,
  StickerFormatType,
} from 'discord.js';
import { DiscordEvent } from '../types/DiscordEvent';
import tagTranscoder from '../utils/tagTranscoder';
import translator from '../translation/translator';
import translateChannels from '../cache/translateChannels';
import channelLinks from '../cache/channelLinks';
import webhookCache from '../cache/webhookCache';
import { SourceLanguageCode, TargetLanguageCode } from 'deepl-node';
import { errorDebug } from '../utils/logger';
import { ITranslateChannel } from '../models/TranslateChannel';
import MessageLink, { IMessageLinkItem } from '../models/MessageLink';

const createTranslateEmbed = (message: Message, translatedContent: string) => {
  return new EmbedBuilder()
    .setColor(0x0099ff)
    .setAuthor({
      name: message.member?.nickname ?? message.author.displayName,
      iconURL:
        message.member?.avatarURL({ size: 32 }) ??
        message.author.displayAvatarURL({ size: 32 }),
    })
    .setDescription(translatedContent)
    .setTimestamp();
};

const translate = async (
  content: string,
  sourceLang: SourceLanguageCode,
  targetLang: TargetLanguageCode
) => {
  if (content.trim() === '') return;

  const [messageToTranslate, tagTable] = tagTranscoder.encode(content);

  const translatedContentToDecode = (
    await translator.translateText(messageToTranslate, sourceLang, targetLang)
  ).text;

  const translatedContent = tagTranscoder.decode(
    translatedContentToDecode,
    tagTable
  );

  return translatedContent;
};

const translateChannel = async (
  message: Message,
  channelId: string,
  sourceTrChannel: ITranslateChannel
) => {
  const channel = message.client.channels.cache.get(channelId);
  if (!channel) return;
  if (channel.type !== ChannelType.GuildText) return;

  const webhook = await webhookCache.get(channel);

  const targetTrChannel = await translateChannels.get(channel.id);
  if (!targetTrChannel) return;

  const username = message.member?.displayName ?? message.author.displayName;
  const avatarURL =
    message.member?.avatarURL() ?? message.author.avatarURL() ?? undefined;

  try {
    // handle sticker-only message
    const sticker = message.stickers.map((sticker) => sticker)[0];
    if (sticker) {
      return await webhook.send({
        username,
        avatarURL,
        content: `https://media.discordapp.net/stickers/${sticker.id}.webp`,
      });
    }

    const translatedContent = await translate(
      message.content,
      sourceTrChannel.sourceLang,
      targetTrChannel.targetLang
    );

    const attachments = message.attachments.map((attachment) => attachment);

    return await webhook.send({
      username,
      avatarURL,
      content: translatedContent,
      files: attachments,
    });
  } catch (error) {
    errorDebug(error);
  }
};

export default {
  name: Events.MessageCreate,
  execute: async (message: Message) => {
    // ignore this bot's webhooks messages
    if (message.author.id !== message.client.user.id && message.webhookId) {
      const webhook = await message.fetchWebhook();
      if (webhook.owner?.id === message.client.user.id) return;
    }

    const sourceTrChannel = await translateChannels.get(message.channelId);
    const link = await channelLinks.get(message.channelId);
    if (!sourceTrChannel || !link) return;

    const messages = await Promise.all(
      link.links.map(async ({ id: channelId }) =>
        translateChannel(message, channelId, sourceTrChannel)
      )
    );

    const messagesIds = messages.filter(Boolean).map<IMessageLinkItem>((m) => ({
      messageId: m!.id,
      channelId: m!.channelId,
    }));
    messagesIds.push({
      messageId: message.id,
      channelId: message.channelId,
    });

    // save messages to db
    const messageLink = new MessageLink({
      authorId: message.author.id,
      messageId: message.id,
      channelId: message.channelId,
      links: messagesIds,
    });
    await messageLink.save();
  },
} as DiscordEvent;

import { ChannelType, EmbedBuilder, Events, Message } from 'discord.js';
import { DiscordEvent } from '../types/DiscordEvent';
import tagTranscoder from '../utils/tagTranscoder';
import translator from '../translation/translator';
import translateChannels from '../cache/translateChannels';
import channelLinks from '../cache/channelLinks';
import webhookCache from '../cache/webhookCache';
import { SourceLanguageCode, TargetLanguageCode } from 'deepl-node';
import { errorDebug } from '../utils/logger';

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

export default {
  name: Events.MessageCreate,
  execute: async (message: Message) => {
    // if it is a bot, ignore
    if (message.author.bot) return;

    const sourceTrChannel = await translateChannels.get(message.channelId);
    const link = await channelLinks.get(message.channelId);
    if (!sourceTrChannel || !link) return;

    await Promise.all(
      link.links.map(async ({ id: channelId }) => {
        const channel = message.client.channels.cache.get(channelId);
        if (!channel) return;
        if (channel.type !== ChannelType.GuildText) return;

        const webhook = await webhookCache.get(channel);

        const targetTrChannel = await translateChannels.get(channel.id);
        if (!targetTrChannel) return;

        try {
          const translatedContent = await translate(
            message.content,
            sourceTrChannel.sourceLang,
            targetTrChannel.targetLang
          );

          const attachments = message.attachments.map(
            (attachment) => attachment
          );

          await webhook.send({
            username: message.member?.displayName ?? message.author.displayName,
            avatarURL:
              message.member?.avatarURL() ??
              message.author.avatarURL() ??
              undefined,
            content: translatedContent,
            files: attachments,
          });
        } catch (error) {
          errorDebug(error);
        }
      })
    );
  },
} as DiscordEvent;

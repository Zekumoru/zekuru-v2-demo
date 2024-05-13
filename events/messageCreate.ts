import { EmbedBuilder, Events, Message } from 'discord.js';
import { DiscordEvent } from '../types/DiscordEvent';
import tagTranscoder from '../utils/tagTranscoder';
import translator from '../translation/translator';
import translateChannels from '../cache/translateChannels';
import channelLinks from '../cache/channelLinks';

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
        if (!channel.isTextBased()) return;

        const targetTrChannel = await translateChannels.get(channel.id);
        if (!targetTrChannel) return;

        try {
          const [messageToTranslate, tagTable] = tagTranscoder.encode(
            message.content
          );

          const translatedContentToDecode = (
            await translator.translateText(
              messageToTranslate,
              sourceTrChannel.sourceLang,
              targetTrChannel.targetLang
            )
          ).text;
          const translatedContent = tagTranscoder.decode(
            translatedContentToDecode,
            tagTable
          );

          await channel.send({
            embeds: [createTranslateEmbed(message, translatedContent)],
          });
        } catch (error) {
          console.error(error);
        }
      })
    );
  },
} as DiscordEvent;

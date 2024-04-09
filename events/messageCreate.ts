import { Collection, EmbedBuilder, Events, Message } from 'discord.js';
import { DiscordEvent } from '../types/DiscordEvent';
import * as deepl from 'deepl-node';
import tagTranscoder from '../utils/tagTranscoder';
import translator from '../translation/translator';

const devGuildId = process.env.GUILD_ID!;

interface TranslateChannel {
  sourceLang: deepl.SourceLanguageCode;
  targetLang: deepl.TargetLanguageCode;
}
const channels = new Collection<string, TranslateChannel>();

// Dev server
channels.set('1224117874029760562', { sourceLang: 'en', targetLang: 'en-US' });
channels.set('1224117938462785586', { sourceLang: 'ja', targetLang: 'ja' });
channels.set('1226929504140918916', { sourceLang: 'it', targetLang: 'it' });

// Yuzuki's Cove
channels.set('988287662580436992', { sourceLang: 'en', targetLang: 'en-US' });
channels.set('988287682142691338', { sourceLang: 'zh', targetLang: 'zh' });
channels.set('988287699876200478', { sourceLang: 'ko', targetLang: 'ko' });
channels.set('1224121528371777567', { sourceLang: 'ja', targetLang: 'ja' });

const channelMap = new Collection<string, string[]>();

// link dev server
['1224117874029760562', '1224117938462785586', '1226929504140918916'].forEach(
  (channelId, _index, array) => {
    const channels = array.filter(
      (secondChannelId) => channelId !== secondChannelId
    );
    channelMap.set(channelId, channels);
  }
);

// link Yuzuki's Cove
[
  '988287662580436992',
  '988287682142691338',
  '988287699876200478',
  '1224121528371777567',
].forEach((channelId, _index, array) => {
  const channels = array.filter(
    (secondChannelId) => channelId !== secondChannelId
  );
  channelMap.set(channelId, channels);
});

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
    // only process this event if in the dev guild
    if (message.guildId !== devGuildId) return;
    // if it is a bot, ignore
    if (message.author.bot) return;

    const sourceLang = channels.get(message.channelId)?.sourceLang;
    const translateChannels = channelMap.get(message.channelId);
    if (!sourceLang || !translateChannels) return;

    await Promise.all(
      translateChannels.map(async (channelId) => {
        const channel = message.client.channels.cache.get(channelId);
        if (!channel) return;
        if (!channel.isTextBased()) return;

        const targetLang = channels.get(channel.id)?.targetLang;
        if (!targetLang) return;

        try {
          const [messageToTranslate, tagTable] = tagTranscoder.encode(
            message.content
          );

          const translatedContentToDecode = (
            await translator.translateText(
              messageToTranslate,
              sourceLang,
              targetLang
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

import Keyv from 'keyv';
import * as deepl from 'deepl-node';

type TChannelId = string;

interface ITranslateChannel {
  sourceLang: deepl.SourceLanguageCode;
  targetLang: deepl.TargetLanguageCode;
}

const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
const keyv = {
  guilds: new Keyv<ITranslateChannel>(MONGODB_CONNECTION_STRING, {
    namespace: 'guilds',
  }),
  links: new Keyv<Map<TChannelId, TChannelId[]>>(MONGODB_CONNECTION_STRING, {
    namespace: 'links',
  }),
  testing: new Keyv<string>(MONGODB_CONNECTION_STRING, {
    namespace: 'testing',
  }),
};

for (const [key, namespace] of Object.entries(keyv)) {
  namespace.on('error', (error) => {
    console.error(`Keyv namespace '${key}' connection error`, error);
  });
}

export default keyv;

import * as deepl from 'deepl-node';
import { appDebug } from '../utils/logger';

const deeplApiKey = process.env.DEEPL_API_KEY;
const translator = new deepl.Translator(deeplApiKey ?? '', {
  appInfo: {
    appName: 'Guide Bot (Zekuru-v2 Demo)',
    appVersion: '0.0.0',
  },
  minTimeout: 1000, // 1 second
  maxRetries: 5,
});

export const targetLanguages: deepl.Language[] = [];
const loadTargetLanguages = async () => {
  targetLanguages.push(
    ...(await translator.getTargetLanguages()).filter(
      (lang) =>
        // push languages without parenthesis like English (American)
        !/\(.*\)/.test(lang.name) ||
        // push languages that are American and European
        lang.name.includes('American') ||
        lang.name.includes('European') ||
        lang.name.includes('simplified')
    )
  );

  appDebug('Target languages loaded.');
};

export const sourceLanguages: deepl.Language[] = [];
const loadSourceLanguages = async () => {
  sourceLanguages.push(...(await translator.getSourceLanguages()));
  appDebug('Source languages loaded.');
};

(async () => {
  await Promise.all([loadTargetLanguages(), loadSourceLanguages()]);
})();

export default translator;

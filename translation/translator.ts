import * as deepl from 'deepl-node';

const deeplApiKey = process.env.DEEPL_API_KEY;
const translator = new deepl.Translator(deeplApiKey ?? '');

export const targetLanguages: deepl.Language[] = [];
const loadTargetLanguages = async () => {
  targetLanguages.push(...(await translator.getTargetLanguages()));
  console.log('Target languages loaded.');
};

export const sourceLanguages: deepl.Language[] = [];
const loadSourceLanguages = async () => {
  sourceLanguages.push(...(await translator.getSourceLanguages()));
  console.log('Source languages loaded.');
};

(async () => {
  await Promise.all([loadTargetLanguages(), loadSourceLanguages()]);
})();

export default translator;

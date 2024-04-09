import * as deepl from 'deepl-node';

const deeplApiKey = process.env.DEEPL_API_KEY;
const translator = new deepl.Translator(deeplApiKey ?? '');

export default translator;

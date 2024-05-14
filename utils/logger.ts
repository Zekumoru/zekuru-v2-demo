import debug from 'debug';

const appName = 'guide-bot';

export const appDebug = debug(`${appName}:app`);
export const errorDebug = debug(`${appName}:error`);

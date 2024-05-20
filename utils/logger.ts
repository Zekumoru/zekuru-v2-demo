import debug from 'debug';

const appName = 'zekuru-v2-demo';

export const appDebug = debug(`${appName}:app`);
export const errorDebug = debug(`${appName}:error`);

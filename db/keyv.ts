import Keyv from 'keyv';
import { errorDebug } from '../utils/logger';

const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
const keyv = {
  testing: new Keyv<string>(MONGODB_CONNECTION_STRING, {
    namespace: 'testing',
  }),
};

for (const [key, namespace] of Object.entries(keyv)) {
  namespace.on('error', (error) => {
    errorDebug(`Keyv namespace '${key}' connection error`, error);
  });
}

export default keyv;

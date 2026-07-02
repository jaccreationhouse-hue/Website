import mongoose from 'mongoose';
import { env } from './env.js';

const globalKey = '__jacCmsMongooseConnection__';

function getConnectionCache() {
  if (!globalThis[globalKey]) {
    globalThis[globalKey] = { promise: null, connection: null };
  }
  return globalThis[globalKey];
}

export async function connectToDatabase() {
  const cache = getConnectionCache();

  if (cache.connection && mongoose.connection.readyState === 1) {
    return cache.connection;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(env.mongoUri).then((connection) => {
      cache.connection = connection;
      return connection;
    }).finally(() => {
      cache.promise = null;
    });
  }

  return cache.promise;
}

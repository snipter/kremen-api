import redis from 'redis';
import { Log } from 'utils';

const log = Log('core.redis');

const {
  env: { REDIS_HOST, REDIS_PORT, REDIS_PASS },
} = process;

export const client = redis.createClient({
  host: REDIS_HOST,
  password: REDIS_PASS,
  port: parseInt(REDIS_PORT, 10),
  retry_strategy: options => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 10 * 60 * 60) {
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  },
});

client.on('error', err => {
  log.err(err);
});

export const cacheWithRootKey = (rootKey: string) => {
  const fkey = (key: string) => `${rootKey}:${key}`;

  const setCache = async <T = any>(key: string, value: T, seconds?: number) =>
    new Promise<void>((resolve, reject) => {
      try {
        const data = JSON.stringify(value);
        log.debug('setting cache with key=', fkey(key));
        log.start(`set ${fkey(key)}`);
        if (seconds) {
          client.setex(fkey(key), seconds, data, err => {
            log.end(`set ${fkey(key)}`);
            err ? reject(err) : resolve();
          });
        } else {
          client.set(fkey(key), data, err => {
            log.end(`set ${fkey(key)}`);
            err ? reject(err) : resolve();
          });
        }
      } catch (err) {
        return reject(err);
      }
    });

  const getCache = async <T = any>(key: string) =>
    new Promise<T | undefined>((resolve, reject) => {
      log.debug('getting cache with key=', fkey(key));
      log.start(`get ${fkey(key)}`);
      client.get(fkey(key), (err, rawData) => {
        log.end(`get ${fkey(key)}`);
        if (err) {
          return reject(err);
        }
        if (!rawData) {
          return resolve(undefined);
        }
        try {
          resolve(JSON.parse(rawData));
        } catch (parsErr) {
          log.err(`parsing cache error: ${parsErr.toString()}`);
          return reject(parsErr);
        }
      });
    });

  return { setCache, getCache };
};

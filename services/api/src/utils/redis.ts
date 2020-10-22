import Redis from 'redis';

import { Log } from './log';

const log = Log('utils.cache');

const getEnvPort = (): number => {
  const {
    env: { REDIS_PORT },
  } = process;
  if (!REDIS_PORT) {
    return 6379;
  }
  const port = parseInt(REDIS_PORT, 10);
  if (isNaN(port)) {
    log.err('redis port is not a number, REDIS_PORT=', REDIS_PORT, ', falling back to default');
    return 6379;
  }
  return port;
};

export const redis = Redis.createClient({
  host: process.env.REDIS_HOST || 'redis',
  port: getEnvPort(),
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

redis.on('error', err => {
  log.err(err);
});

export const cacheWithRootKey = (rootKey: string) => {
  const fkey = (key: string) => `cache:${rootKey}:${key}`;

  const setCache = async <T = any>(key: string, value: T, seconds?: number) =>
    new Promise<void>((resolve, reject) => {
      try {
        const data = JSON.stringify(value);
        log.debug('setting cache with key=', fkey(key));
        log.start(`set ${fkey(key)}`);
        if (seconds) {
          redis.setex(fkey(key), seconds, data, err => {
            log.end(`set ${fkey(key)}`);
            err ? reject(err) : resolve();
          });
        } else {
          redis.set(fkey(key), data, err => {
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
      redis.get(fkey(key), (err, rawData) => {
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

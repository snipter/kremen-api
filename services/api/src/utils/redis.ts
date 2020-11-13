import Redis from 'redis';
import { getEnvs } from './envs';

import { Log } from './log';

const log = Log('utils.redis');

const { redisPort } = getEnvs();

export const redis = Redis.createClient({
  host: process.env.REDIS_HOST || 'redis',
  port: redisPort,
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
  log.err(err.message);
});

const set = async (key: string, value: string) =>
  new Promise<string>((resolve, reject) => redis.set(key, value, (err, res) => (err ? reject(err) : resolve(res))));

const get = async (key: string) =>
  new Promise<string | undefined>((resolve, reject) =>
    redis.get(key, (err, res) => (err ? reject(err) : resolve(res ? res : undefined))),
  );

const setex = async (key: string, seconds: number, value: string) =>
  new Promise<string>((resolve, reject) =>
    redis.setex(key, seconds, value, (err, res) => (err ? reject(err) : resolve(res))),
  );

export const cacheWithRootKey = (rootKey: string) => {
  const fkey = (key: string) => `cache:${rootKey}:${key}`;

  const setCache = async <T = any>(key: string, value: T, seconds?: number) => {
    const data = JSON.stringify(value);
    const ckey = fkey(key);
    log.debug('setting cache with key=', ckey);
    try {
      log.start(`set ${ckey}`);
      if (seconds) {
        await setex(ckey, seconds, data);
      } else {
        await set(ckey, data);
      }
    } catch (err) {
      log.err('set chache err: ', err.message);
    } finally {
      log.start(`set ${ckey}`);
    }
  };

  const getCache = async <T = unknown>(key: string): Promise<T | undefined> => {
    const ckey = fkey(key);
    log.debug(`getting cache with key= ${ckey}`);
    try {
      log.start(`get ${ckey}`);
      const rawData = await get(ckey);
      if (!rawData) {
        return undefined;
      }
      const data = JSON.parse(rawData);
      return (data as unknown) as T;
    } catch (err) {
      log.err('get chache err: ', err.message);
      return undefined;
    } finally {
      log.end(`get ${ckey}`);
    }
  };

  return { setCache, getCache };
};

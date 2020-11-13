import { isString, isUndefined } from 'lodash';
import { Log } from './log';

const log = Log('utils.envs');

export type NodeEnv = 'dev' | 'prd' | 'loc';

export const getEnvs = () => ({
  env: getNodeEnv('NODE_ENV', 'prd'),
  port: getIntEnv('PORT', 8080),
  cacheEnabled: getBoolEnv('CACHE_ENABLED', true),
  redisPort: getIntEnv('REDIS_PORT', 6379),
});

const getNodeEnv = (name: string, def: NodeEnv): NodeEnv => {
  const val = process.env[name];
  if (!isString(val)) {
    return def;
  }
  switch (val.toLowerCase()) {
    case 'dev':
      return 'dev';
    case 'loc':
      return 'loc';
    case 'prd':
      return 'prd';
    default:
      return def;
  }
};

const getBoolEnv = (name: string, def: boolean): boolean => {
  const val = process.env[name];
  if (isUndefined(val)) {
    return def;
  }
  if (['1', 'true'].includes(val)) {
    return true;
  }
  if (['0', 'false'].includes(val)) {
    return false;
  }
  return def;
};

const getIntEnv = (name: string, def: number): number => {
  const val = process.env[name];
  if (isUndefined(val)) {
    return def;
  }
  const num = parseInt(val, 10);
  if (isNaN(num)) {
    log.err(`parsing env variable err: ${name} is not a number, falling back to default=${def}`);
    return def;
  }
  return num;
};

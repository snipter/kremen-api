import { isUndefined } from 'lodash';

export const getBoolEnv = (name: string, def: boolean): boolean => {
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

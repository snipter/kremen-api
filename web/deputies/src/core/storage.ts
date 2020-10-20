import { isBoolean, isNumber, isString } from 'lodash';
import { Log } from 'utils';
const log = Log('storage');

const pref = 'kremen:deputies';

// Bool

export const getBoolConfig = (key: string, defaultValue: boolean): boolean => {
  const val = getConfig(key);
  return isBoolean(val) ? val : defaultValue;
};

export const setBoolConfig = (key: string, val: boolean) => setConfig(key, val);

// Number

export const getNumberConfig = (key: string, defaultValue: number): number => {
  const val = getConfig(key);
  return isNumber(val) ? val : defaultValue;
};

export const setNumberConfig = (key: string, val: number) => setConfig(key, val);

// String

export const getStringConfig = (key: string, defaultValue: string): string => {
  const val = getConfig(key);
  return isString(val) ? val : defaultValue;
};

export const setStringConfig = (key: string, val: string) => setConfig(key, val);

// Basic

const getFullKey = (key: string) => `${pref}:${key}`;

export const getConfig = <T>(key: string): T | undefined => {
  const fullKey = getFullKey(key);
  const val = localStorage.getItem(fullKey);
  if (val === undefined) {
    return undefined;
  }
  if (!isString(val)) {
    return undefined;
  }
  try {
    return JSON.parse(val);
  } catch (err) {
    log.err('parsing error, err=', err);
    return undefined;
  }
};

export const setConfig = <T>(key: string, val: T) => {
  const fullKey = getFullKey(key);
  const valStr = JSON.stringify(val);
  localStorage.setItem(fullKey, valStr);
};

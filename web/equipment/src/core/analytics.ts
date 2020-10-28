import { Log } from 'utils';
import { genId } from 'utils';

import { getConf, setConf } from './configs';
import getUserLocale, { getUserLocales } from './locales';

const log = Log('core.analytics');

const enabled = ENV !== 'dev';

// User

const getUID = (): string => {
  const storedUid = getConf<string>('uid');
  if (storedUid) {
    return storedUid;
  }
  const newUid = genId();
  setConf('uid', newUid);
  return newUid;
};

/**
 * Unique User ID
 */
export const uid = getUID();

const initUser = () => {
  if (!enabled) {
    return;
  }
  log.info('analytics enabled');
  const locale = getUserLocale();
  const locales = getUserLocales();
  log.debug('locale=', locale, ', locales=', locales);
};

initUser();

export const track = (event: string, params?: Record<string, string | number | boolean>) => {
  if (!enabled) {
    return;
  }
  log.debug('track event=', event, ', params=', params);
};

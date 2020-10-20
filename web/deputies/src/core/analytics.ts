import mixpanel, { Dict } from 'mixpanel-browser';
import { Log } from 'utils';
import getUserLocale, { getUserLocales } from './locales';
const log = Log('core.analytics');

const enabled = ENV !== 'dev' ? true : false;
// const enabled = true;

mixpanel.init('325fbae612a3cd571f0b3a5fc45230bb');

const initUser = () => {
  if (!enabled) { return; }
  log.info('analytics enabled');
  mixpanel.identify();
  const locale = getUserLocale();
  const locales = getUserLocales();
  log.debug('locale=', locale, ', locales=', locales);
  mixpanel.people.set({
    version: VERSION,
    locale,
    locales,
  });
};

initUser();

/**
 * Metric Events
 */
export type MetricEvent =
  'AboutScreenVisit' |
  'DistrictsMapScreenVisist' |
  'RightsScreenVisit' |
  'DistrictClick' |
  'SearchPlaceResultClick';

/**
 * Track event
 * @param {MetricEvent} event - event name
 * @param {Dict?} params - event additional data
 */
export const track = (event: MetricEvent, params?: Dict) => {
  log.debug('track event=', event);
  if (!enabled) { return; }
  mixpanel.track(event, params);
};

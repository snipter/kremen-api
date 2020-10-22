import { Express } from 'express';
import { cacheWithRootKey, getBoolEnv, Log, minSec, serverErrResp } from 'utils';

import { getEquipmentApi } from './api';
import { EquipmentTimer } from './types';

const log = Log('api.equipment');

const { getCache, setCache } = cacheWithRootKey('equipment');

export const initEquipmentApi = (app: Express) => {
  const cacheEnabled = getBoolEnv('CACHE_ENABLED', true);
  log.info('init api, cache enabled=', cacheEnabled);

  app.get('/equipment', async (req, res) => {
    const sid = cacheEnabled ? await getCache<string>('sid') : undefined;
    const timer = cacheEnabled ? await getCache<EquipmentTimer>('timer') : undefined;
    const api = getEquipmentApi({ sid });
    const data = await api.list(timer);
    if (!data) {
      return serverErrResp(res, 'Parsed data is empty');
    }
    const { equipment, system } = data;
    res.json(equipment);
    if (cacheEnabled) {
      setCache('sid', system.sid, minSec * 5);
      setCache('timer', system.timer, minSec * 5);
    }
  });
};

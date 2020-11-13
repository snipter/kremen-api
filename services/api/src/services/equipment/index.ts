import { Express } from 'express';
import { cacheWithRootKey, DataSourceError, getEnvs, Log, minSec, respWithErr, serverErrResp } from 'utils';

import { getEquipmentApi } from './api';
import { EquipmentTimer } from './types';

const log = Log('api.equipment');

const { getCache, setCache } = cacheWithRootKey('equipment');
const { cacheEnabled } = getEnvs();

export const initEquipmentApi = (app: Express) => {
  log.info('init api, cache enabled=', cacheEnabled);

  app.get('/equipment', async (req, res) => {
    try {
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
    } catch (err) {
      return respWithErr(res, err);
    }
  });
};

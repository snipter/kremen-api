import { Express } from 'express';
import { isString } from 'lodash';
import {
  cacheWithRootKey,
  getEnvs,
  hourSec,
  Log,
  okResp,
  paramMissedResp,
  paramWrongFormatResp,
  parseIdsStr,
  respWithErr,
  sec,
} from 'utils';

import { getTransportApi } from './api';
import { strToLatLng } from './utils';

const log = Log('transport');

const { cacheEnabled } = getEnvs();
const { getCache, setCache } = cacheWithRootKey({ rootKey: 'transport', enabled: cacheEnabled });

export const initTransportApi = (app: Express) => {
  log.info('init api');

  const api = getTransportApi().withCity();

  app.get('/transport/routes', async (req, res) => {
    try {
      const cache = await getCache('routes');
      if (cache) {
        return okResp(res, cache);
      }
      const data = await api.getRoutesWithStations();
      okResp(res, data);
      setCache('routes', data, hourSec);
    } catch (err) {
      return respWithErr(res, err);
    }
  });

  app.get('/transport/buses', async (req, res) => {
    try {
      const { query = {} } = req;
      const cacheKey = isString(query.rids) ? `buses:${query.rids}` : `buses`;
      const cache = await getCache(cacheKey);
      if (cache) {
        return okResp(res, cache);
      }
      const rids = isString(query.rids) ? parseIdsStr(query.rids) : undefined;
      const data = await api.getRoutesBuses(rids);
      okResp(res, data);
      setCache(cacheKey, data, sec * 5);
    } catch (err) {
      return respWithErr(res, err);
    }
  });

  // Search

  app.get('/transport/find', async (req, res) => {
    try {
      const { query = {} } = req;
      const { from: fromStr, to: toStr } = query;
      if (!fromStr || !isString(fromStr)) {
        return paramMissedResp(res, 'from');
      }
      const from = strToLatLng(fromStr);
      if (!from) {
        return paramWrongFormatResp(res, 'from');
      }
      if (!toStr || !isString(toStr)) {
        return paramMissedResp(res, 'to');
      }
      const to = strToLatLng(toStr);
      if (!to) {
        return paramWrongFormatResp(res, 'to');
      }
      const data = await api.findRoute(from, to);
      return okResp(res, data);
    } catch (err) {
      return respWithErr(res, err);
    }
  });

  // Station specific data

  app.get('/transport/buses/stations', async (req, res) => {
    try {
      const { query = {} } = req;
      const rids = isString(query.rids) ? parseIdsStr(query.rids) : undefined;
      const data = await api.getRoutesStations(rids);
      return okResp(res, data);
    } catch (err) {
      return respWithErr(res, err);
    }
  });

  app.get('/transport/stations/:id/prediction', async (req, res) => {
    try {
      const { params = {} } = req;
      if (!params.id) {
        return paramMissedResp(res, 'id');
      }
      const id = parseInt(params.id, 10);
      if (isNaN(id)) {
        return paramWrongFormatResp(res, 'id');
      }
      const data = await api.getStationPrediction(id);
      return okResp(res, data);
    } catch (err) {
      return respWithErr(res, err);
    }
  });

  // Route specific data

  app.get('/transport/routes/:id/buses', async (req, res) => {
    try {
      const { params = {} } = req;
      if (!params.id) {
        return paramMissedResp(res, 'id');
      }
      const id = parseInt(params.id, 10);
      if (isNaN(id)) {
        return paramWrongFormatResp(res, 'id');
      }
      const data = await api.getRouteBuses(id);
      return okResp(res, data);
    } catch (err) {
      return respWithErr(res, err);
    }
  });

  app.get('/transport/routes/:id/stations', async (req, res) => {
    try {
      const { params = {} } = req;
      if (!params.id) {
        return paramMissedResp(res, 'id');
      }
      const id = parseInt(params.id, 10);
      if (isNaN(id)) {
        return paramWrongFormatResp(res, 'id');
      }
      const data = await api.getRouteStations(id);
      return okResp(res, data);
    } catch (err) {
      return respWithErr(res, err);
    }
  });
};

import { Express } from 'express';
import { isString } from 'lodash';
import { Log, okResp, paramMissedResp, paramWrongFormatResp, parseIdsStr } from 'utils';

import { getTransportApi } from './api';
import { defTransportRoutesIds } from './consts';
import { strToLatLng } from './utils';

const log = Log('services.transport');

export const initTransportApi = (app: Express) => {
  log.info('init api');

  const api = getTransportApi().withCity();

  app.get('/transport/routes', async (req, res) => {
    const [routes, stations] = await Promise.all([api.getRoutes(), api.getRoutesStations(defTransportRoutesIds)]);
    const data = routes.map(route => {
      const routeStations = stations.filter(({ rid }) => rid === route.rid);
      return { ...route, stations: routeStations };
    });
    res.json(data);
  });

  app.get('/transport/find', async (req, res) => {
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
  });

  app.get('/transport/buses', async (req, res) => {
    const { query = {} } = req;
    const rids = isString(query.rids) ? parseIdsStr(query.rids) : defTransportRoutesIds;
    const data = await api.getRoutesBuses(rids);
    return okResp(res, data);
  });

  app.get('/transport/buses/update', async (req, res) => {
    const { query = {} } = req;
    const rids = isString(query.rids) ? parseIdsStr(query.rids) : defTransportRoutesIds;
    const data = await api.getRoutesBusesUpdate(rids);
    return okResp(res, data);
  });

  app.get('/transport/buses/stations', async (req, res) => {
    const { query = {} } = req;
    const rids = isString(query.rids) ? parseIdsStr(query.rids) : defTransportRoutesIds;
    const data = await api.getRoutesStations(rids);
    return okResp(res, data);
  });

  app.get('/transport/stations/:id/prediction', async (req, res) => {
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
  });

  app.get('/transport/routes/:id/buses', async (req, res) => {
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
  });

  app.get('/transport/routes/:id/stations', async (req, res) => {
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
  });
};

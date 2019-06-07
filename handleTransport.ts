import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { withCity, strToLatLng } from 'services/transport';
import { Log, okResp, serverErrResp, notFoundResp, paramMissedResp, paramWrongFormatResp, daySec, isCacheEnabled } from 'utils';
import { IStrParams } from 'core';
import { cacheWithRootKey } from 'core/cache';
const log = Log('transport.handler');
// Cache
const { env: { NODE_ENV } } = process;
const cacheRootKey = `kremen:transport:${NODE_ENV}`;
const { getCache, setCache } = cacheWithRootKey(cacheRootKey);

const cityId = 10;
const api = withCity(cityId);
const defRouteIds = [
  192, 190, 189, 187, 188, 191, 179, 166, 170,
  171, 184, 186, 173, 185, 181, 183, 168, 175,
  172, 182, 167, 178, 180, 169, 174, 193, 
];

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  log.trace('event=', event);
  log.start(`resource ${event.resource}`);
  const res = await processEvent(event);
  log.end(`resource ${event.resource}`);
  return res;
}

const processEvent = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { resource, pathParameters, queryStringParameters: qs } = event;
  const cache = isCacheEnabled(qs);
  log.debug('cache=', cache);
  try {
    if (resource === '/transport/routes') {
      return handleRoutes(cache);
    }
    if (resource === '/transport/find') {
      return handleFind(qs);
    }
    if (resource === '/transport/buses') {
      return handleBuses();
    }
    if (resource === '/transport/buses/update') {
      return handleBusesUpdate();
    }
    if (resource === '/transport/stations') {
      return handleStations(cache);
    }
    if (resource === '/transport/stations/{id}/prediction') {
      return handleStationPrediction(pathParameters);
    }
    if (resource === '/transport/routes/{id}/buses') {
      return handleRoutesBuses(pathParameters);
    }
    if (resource === '/transport/routes/{id}/stations') {
      return handleRoutesStations(pathParameters);
    }
    return notFoundResp(`${resource} not found`);
  } catch(err) {
    log.err(err);
    return serverErrResp(err.message);
  }
}

const handleRoutes = async (cache: boolean) => {
  const cacheKey = 'routes';
  const cacheData = cache ? await getCache(cacheKey) : undefined;
  if (cacheData) { log.debug('found data in cache'); return okResp(cacheData, true); }
  const [routes, stations] = await Promise.all([
    api.getRoutes(),
    api.getRoutesStations(defRouteIds),
  ]);
  const data = routes.map((route) => {
    const routeStations = stations.filter(({ rid }) => rid === route.rid);
    return {...route, stations: routeStations};
  });
  await setCache(cacheKey, data, daySec);
  return okResp(data);
}

const handleFind = async (qs: IStrParams | null) => {
  if (!qs) { return paramMissedResp('from'); }
  const { from: fromStr, to: toStr } = qs;
  if (!fromStr) { return paramMissedResp('from'); }
  const from = strToLatLng(fromStr);
  if (!from) { return paramWrongFormatResp('from'); }
  if (!toStr) { return paramMissedResp('to'); }
  const to = strToLatLng(toStr);
  if (!to) { return paramWrongFormatResp('to'); }
  const data = await api.findRoute(from, to);
  return okResp(data);
}

const handleRoutesBuses = async (pathParameters: IStrParams) => {
  if (!pathParameters || !pathParameters.id) { return paramMissedResp('id'); }
  const id = parseInt(pathParameters.id, 10);
  if (isNaN(id)) { return paramWrongFormatResp('id'); }
  const data = await api.getRouteBuses(id);
  return okResp(data);
}

const handleRoutesStations = async (pathParameters: IStrParams) => {
  if (!pathParameters || !pathParameters.id) { return paramMissedResp('id'); }
  const id = parseInt(pathParameters.id, 10);
  if (isNaN(id)) { return paramWrongFormatResp('id'); }
  return okResp(await api.getRouteStations(id));
}

const handleBuses = async () => {
  const data = await api.getRoutesBuses(defRouteIds);
  return okResp(data);
}

const handleBusesUpdate = async () => {
  const data = await api.getRoutesBusesUpdate(defRouteIds);
  return okResp(data);
}

const handleStations = async (cache: boolean) => {
  const cacheKey = 'stations';
  const cacheData = cache ? await getCache(cacheKey) : undefined;
  if (cacheData) { log.debug('found data in cache'); return okResp(cacheData, true); }
  const data = await api.getRoutesStations(defRouteIds);
  await setCache(cacheKey, data, daySec);
  return okResp(data);
}

const handleStationPrediction = async (pathParameters: IStrParams) => {
  if (!pathParameters || !pathParameters.id) { return paramMissedResp('id'); }
  const id = parseInt(pathParameters.id, 10);
  if (isNaN(id)) { return paramWrongFormatResp('id'); }
  return okResp(await api.getStationPrediction(id));
}
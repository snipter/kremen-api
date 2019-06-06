import { APIGatewayProxyHandler } from 'aws-lambda';
import { withCity } from 'services/transport';
import { Log, okResp, serverErrResp, notFoundResp, paramMissedResp, paramWrongFormatResp, daySec } from 'utils';
import { ILatLng, IQueryStringParams } from 'core';
import { cacheWithRootKey } from 'core/cache';
const log = Log('transport.handler');
// Cache
const { env: { NODE_ENV } } = process;
const cacheRootKey = `kremen:transport:${NODE_ENV}`;
const { getCache, setCache } = cacheWithRootKey(cacheRootKey);

const transportCityId = 10;
const allRouteIds = [
  192, 190, 189, 187, 188, 191, 179, 166, 170,
  171, 184, 186, 173, 185, 181, 183, 168, 175,
  172, 182, 167, 178, 180, 169, 174, 193, 
];

const strToLatLng = (val: string): ILatLng | undefined => {
  if (!val) { return undefined; }
  const parts = val.split(',');
  if (parts.length !== 2) return undefined;
  const lat = parseFloat(parts[0]);
  if (isNaN(lat)) { return undefined; }
  const lng = parseFloat(parts[1]);
  if (isNaN(lng)) { return undefined; }
  return { lat, lng };
}

const isCacheEnabled = (qs: IQueryStringParams | null): boolean => {
  if (!qs) { return true; }
  if (qs.cache === undefined) { return true; }
  return (qs.cache === 'false') || (qs.cache === '0') ? false : true;
}

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  log.trace('event=', event);
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
    if (resource === '/transport/routes/{id}/buses') {
      return handleRoutesBuses(pathParameters);
    }
    if (resource === '/transport/routes/{id}/stations') {
      return handleRoutesStations(pathParameters);
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
  log.start('transport/routes');
  const [routes, stations] = await Promise.all([
    withCity(transportCityId).getRoutes(),
    withCity(transportCityId).getRoutesStations(allRouteIds),
  ]);
  const data = routes.map((route) => {
    const stationsData = stations.find(({ rid }) => rid === route.rid);
    return stationsData ? {...route, stations: stationsData.stations} : route;
  });
  log.end('transport/routes');
  await setCache(cacheKey, data, daySec);
  return okResp(data);
}

const handleFind = async (qs: IQueryStringParams | null) => {
  if (!qs) { return paramMissedResp('from'); }
  const { from: fromStr, to: toStr } = qs;
  if (!fromStr) { return paramMissedResp('from'); }
  const from = strToLatLng(fromStr);
  if (!from) { return paramWrongFormatResp('from'); }
  if (!toStr) { return paramMissedResp('to'); }
  const to = strToLatLng(toStr);
  if (!to) { return paramWrongFormatResp('to'); }
  log.start('transport/find');
  const data = await withCity(transportCityId).findRoute(from, to);
  log.end('transport/find');
  return okResp(data);
}

const handleRoutesBuses = async (pathParameters: IQueryStringParams) => {
  if (!pathParameters || !pathParameters.id) { return paramMissedResp('id'); }
  const id = parseInt(pathParameters.id, 10);
  if (isNaN(id)) { return paramWrongFormatResp('id'); }
  const data = await withCity(transportCityId).getBusesAtRoute(id);
  return okResp(data);
}

const handleRoutesStations = async (pathParameters: IQueryStringParams) => {
  if (!pathParameters || !pathParameters.id) { return paramMissedResp('id'); }
  const id = parseInt(pathParameters.id, 10);
  if (isNaN(id)) { return paramWrongFormatResp('id'); }
  return okResp(await withCity(transportCityId).getRouteStations(id));
}

const handleBuses = async () => {
  log.start('transport/buses');
  const data = await withCity(transportCityId).getBusesAtRoutes(allRouteIds);
  log.end('transport/buses');
  return okResp(data);
}

const handleBusesUpdate = async () => {
  log.start('transport/buses/short');
  const data = await withCity(transportCityId).getBusesShortInfo(allRouteIds);
  log.end('transport/buses/short');
  return okResp(data);
}

const handleStations = async (cache: boolean) => {
  const cacheKey = 'stations';
  const cacheData = cache ? await getCache(cacheKey) : undefined;
  if (cacheData) { log.debug('found data in cache'); return okResp(cacheData, true); }
  log.start('transport/stations');
  const data = await withCity(transportCityId).getRoutesStations(allRouteIds);
  log.end('transport/stations');
  await setCache(cacheKey, data, daySec);
  return okResp(data);
}
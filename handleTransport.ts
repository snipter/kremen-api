import { APIGatewayProxyHandler } from 'aws-lambda';
import { withCity } from 'lib/transport';
import { Log, okResp, serverErrResp, notFoundResp, paramMissedResp, paramWrongFormatResp } from 'utils';
import { ILatLng } from 'core';
const log = Log('transport.handler');

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

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  log.trace('event=', event);
  try {
    const { resource, pathParameters, queryStringParameters } = event;
    if (resource === '/transport/routes') {
      log.start('/transport/routes');
      const data = await withCity(transportCityId).getRoutes();
      log.end('/transport/routes');
      return okResp(data);
    }
    if (resource === '/transport/find') {
      if (!queryStringParameters) { return paramMissedResp('from'); }
      const { from: fromStr, to: toStr } = queryStringParameters;
      if (!fromStr) { return paramMissedResp('from'); }
      const from = strToLatLng(fromStr);
      if (!from) { return paramWrongFormatResp('from'); }
      if (!toStr) { return paramMissedResp('to'); }
      const to = strToLatLng(toStr);
      if (!to) { return paramWrongFormatResp('to'); }
      log.start('/transport/find');
      const data = await withCity(transportCityId).findRoute(from, to);
      log.end('/transport/find');
      return okResp(data);
    }
    if (resource === '/transport/routes/{id}/buses') {
      if (!pathParameters || !pathParameters.id) { return paramMissedResp('id'); }
      const id = parseInt(pathParameters.id, 10);
      if (isNaN(id)) { return paramMissedResp('id'); }
      const data = await withCity(transportCityId).getBusesAtRoute(id);
      return okResp(data);
    }
    if (resource === '/transport/routes/{id}/stations') {
      if (!pathParameters || !pathParameters.id) { return paramMissedResp('id'); }
      const id = parseInt(pathParameters.id, 10);
      if (isNaN(id)) { return paramMissedResp('id'); }
      return okResp(await withCity(transportCityId).getRouteStations(id));
    }
    if (resource === '/transport/buses') {
      log.start('/transport/buses');
      const data = await withCity(transportCityId).getBusesAtRoutes(allRouteIds);
      log.end('/transport/buses');
      return okResp(data);
    }
    if (resource === '/transport/buses/short') {
      log.start('/transport/buses/short');
      const data = await withCity(transportCityId).getBusesShortInfo(allRouteIds);
      log.end('/transport/buses/short');
      return okResp(data);
    }
    if (resource === '/transport/stations') {
      log.start('/transport/stations');
      const data = await withCity(transportCityId).getRoutesStations(allRouteIds);
      log.end('/transport/stations');
      return okResp(data);
    }
    return notFoundResp(`${resource} not found`);
  } catch(err) {
    log.err(err);
    return serverErrResp(err.message);
  }
}

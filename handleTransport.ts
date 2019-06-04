import { APIGatewayProxyHandler } from 'aws-lambda';
import { withCity } from 'lib/transport';
import { Log, okResp, serverErrResp, notFoundResp, paramReqResp } from 'utils';
const log = Log('transport.handler');

const transportCityId = 10;
const allRouteIds = [
  192, 190, 189, 187, 188, 191, 179, 166, 170,
  171, 184, 186, 173, 185, 181, 183, 168, 175,
  172, 182, 167, 178, 180, 169, 174, 193, 
];

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  log.trace('event=', event);
  try {
    const { resource, pathParameters } = event;
    if (resource === '/transport/routes') {
      log.start('/transport/routes');
      const data = await withCity(transportCityId).getRoutes();
      log.end('/transport/routes');
      return okResp(data);
    }
    if (resource === '/transport/routes/{id}/buses') {
      if (!pathParameters || !pathParameters.id) { return paramReqResp('id'); }
      const id = parseInt(pathParameters.id, 10);
      if (isNaN(id)) { return paramReqResp('id'); }
      const data = await withCity(transportCityId).getBusesAtRoute(id);
      return okResp(data);
    }
    if (resource === '/transport/routes/{id}/stations') {
      if (!pathParameters || !pathParameters.id) { return paramReqResp('id'); }
      const id = parseInt(pathParameters.id, 10);
      if (isNaN(id)) { return paramReqResp('id'); }
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

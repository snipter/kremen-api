import { APIGatewayProxyHandler } from 'aws-lambda';
import { withCity } from 'lib/transport';
import { Log, okResp, serverErrResp } from 'utils';
const log = Log('TransportHandler');

const kremenCityId = 10;
const allRouteIds = [
  192, 190, 189, 187, 188, 191, 179, 166, 170,
  171, 184, 186, 173, 185, 181, 183, 168, 175,
  172, 182, 167, 178, 180, 169, 174, 193, 
];

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const { path } = event;
    if (path === '/transport/routes') {
      return handleRoutes();
    }
    if (path === '/transport/buses/all') {
      return handleAllBuses();
    }
  } catch(err) {
    return serverErrResp(err.message);
  }
}

const handleAllBuses = async () => {
  log.start('handleAllBusses');
  const data = await withCity(kremenCityId).getBusesAtRoutes(allRouteIds);
  log.end('handleAllBusses');
  return okResp(data);
}

const handleRoutes = async () => {
    log.start('handleRoutes');
    const data = await withCity(kremenCityId).getRoutes();
    log.end('handleRoutes');
    return okResp(data);
}

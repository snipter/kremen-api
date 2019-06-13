import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import EquipmentParser, { IEquipTimer } from 'services/equipment';
import { Log, isCacheEnabled, serverErrResp, notFoundResp, okResp, minSec } from 'utils';
import { cacheWithRootKey } from 'core/cache';

// Log
const log = Log('equipment.handler');

// Cache
const { env: { NODE_ENV } } = process;
const cacheRootKey = `kremen:equipment:${NODE_ENV}`;
const { getCache, setCache } = cacheWithRootKey(cacheRootKey);

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  log.trace('event=', event);
  log.start(`resource ${event.resource}`);
  const res = await processEvent(event);
  log.end(`resource ${event.resource}`);
  return res;
}

const processEvent = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { resource, queryStringParameters } = event;
  const cache = isCacheEnabled(queryStringParameters);
  log.debug('cache=', cache);
  try {
    if (resource === '/equipment') {
      return handleEquipmentList(cache);
    }
    return notFoundResp(`${resource} not found`);
  } catch(err) {
    log.err(err);
    return serverErrResp(err.message);
  }
}

export const handleEquipmentList = async (cache: boolean) => {
  const sid = cache ? await getCache<string>('sid') : null;
  const timer = cache ? await getCache<IEquipTimer>('timer') : null;
  const parser = new EquipmentParser(sid);
  const data = await parser.list(timer);
  if (!data) { throw new Error('Parser dat is empty'); }
  const { equipment, system } = data;
  await setCache('sid', system.sid, minSec * 5);
  await setCache('timer', system.timer, minSec * 5);
  await setCache('items', equipment, minSec * 5);
  return okResp(equipment);
};

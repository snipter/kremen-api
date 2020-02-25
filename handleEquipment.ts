import { EquipmentTimer, getEquipmentApi } from '@kremen/core';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { cacheWithRootKey } from 'core/cache';
import { isCacheEnabled, Log, minSec, notFoundResp, okResp, requestHttpReqHandler, serverErrResp } from 'utils';

const log = Log('equipment.handler');

const {
  env: { NODE_ENV },
} = process;
const cacheRootKey = `kremen:equipment:${NODE_ENV}`;
const { getCache, setCache } = cacheWithRootKey(cacheRootKey);

export const handler: APIGatewayProxyHandler = async (event) => {
  log.trace('event=', event);
  log.start(`resource ${event.resource}`);
  const res = await processEvent(event);
  log.end(`resource ${event.resource}`);
  return res;
};

const processEvent = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { resource, queryStringParameters } = event;
  const cache = isCacheEnabled(queryStringParameters);
  log.debug('cache=', cache);
  try {
    if (resource === '/equipment') {
      return handleEquipmentList(cache);
    }
    return notFoundResp(`${resource} not found`);
  } catch (err) {
    log.err(err);
    return serverErrResp(err.message);
  }
};

export const handleEquipmentList = async (cache: boolean) => {
  // const sid = cache ? await getCache<string>('sid') : undefined;
  const timer = cache ? await getCache<EquipmentTimer>('timer') : undefined;
  const api = getEquipmentApi({ reqHandler: requestHttpReqHandler, log });
  const data = await api.list(timer);
  if (!data) {
    throw new Error('Parser dat is empty');
  }
  const { equipment, system } = data;
  await setCache('sid', system.sid, minSec * 5);
  await setCache('timer', system.timer, minSec * 5);
  await setCache('items', equipment, minSec * 5);
  return okResp(equipment);
};

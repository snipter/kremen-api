import { EquipmentTimer, getEquipmentApi, Log } from '@kremen/core';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { cacheWithRootKey } from 'core/cache';
import { isCacheEnabled, minSec, notFoundResp, okResp, requestHttpReqHandler, serverErrResp } from 'utils';

const log = Log('equipment.handler');

const {
  env: { NODE_ENV },
} = process;
const cacheRootKey = `kremen:equipment:${NODE_ENV}`;
const { getCache, setCache } = cacheWithRootKey(cacheRootKey);

export const handler: APIGatewayProxyHandler = async event => {
  log.trace('event=', event);
  log.start(`resource ${event.resource}`);
  try {
    const res = await processEvent(event);
    log.end(`resource ${event.resource}`);
    return res;
  } catch (err) {
    log.end(`resource ${event.resource}`);
    log.err(err);
    return serverErrResp(err.message);
  }
};

const processEvent = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { resource, queryStringParameters } = event;
  const cache = isCacheEnabled(queryStringParameters);
  log.debug('cache=', cache);
  if (resource === '/equipment') {
    return handleEquipmentList(cache);
  }
  return notFoundResp(`${resource} not found`);
};

export const handleEquipmentList = async (cache: boolean) => {
  const sid = cache ? await getCache<string>('sid') : undefined;
  const timer = cache ? await getCache<EquipmentTimer>('timer') : undefined;
  const api = getEquipmentApi({ reqHandler: requestHttpReqHandler, log, sid });
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
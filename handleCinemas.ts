import { CinemaApiOpt, cinemaIdToHandler, getCinemasApis, Log } from '@kremen/core';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import cheerio from 'cheerio';
import { cacheWithRootKey } from 'core/cache';
import { hourSec, isCacheEnabled, notFoundResp, okResp, requestHttpReqHandler, serverErrResp } from 'utils';

const log = Log('cinemas.handler');

const {
  env: { NODE_ENV },
} = process;
const cacheRootKey = `kremen:cinemas:${NODE_ENV}`;
const { getCache, setCache } = cacheWithRootKey(cacheRootKey);

const defApiOpt: CinemaApiOpt = {
  reqHandler: requestHttpReqHandler,
  htmlParser: cheerio,
};

export const handler: APIGatewayProxyHandler = async event => {
  log.trace('event=', event);
  log.start(`resource ${event.resource}`);
  const res = await processEvent(event);
  log.end(`resource ${event.resource}`);
  return res;
};

const processEvent = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { resource, queryStringParameters, pathParameters } = event;
  const cache = isCacheEnabled(queryStringParameters);
  log.debug('cache=', cache);
  try {
    if (resource === '/cinemas') {
      return handleCinemas(cache);
    }
    if (resource === '/cinemas/{cid}') {
      if (!pathParameters || !pathParameters['cid']) {
        return notFoundResp('cid not found');
      }
      return handleCinema(pathParameters['cid'], cache);
    }
    return notFoundResp(`${resource} not found`);
  } catch (err) {
    log.err(err);
    return serverErrResp(err.message);
  }
};

const handleCinemas = async (cache: boolean) => {
  const cachedData = cache ? await getCache<string>('all') : undefined;
  if (cachedData) {
    return okResp(cachedData);
  }
  const data = await Promise.all(
    getCinemasApis()
      .map(handler => handler(defApiOpt))
      .map(api => api.getCinema()),
  );
  await setCache('all', data, hourSec);
  return okResp(data);
};

const handleCinema = async (cid: string, cache: boolean) => {
  const getCinemaApi = cinemaIdToHandler(cid);
  if (!getCinemaApi) {
    return notFoundResp(`cinema not found: ${cid}`);
  }
  const cachedData = cache ? await getCache<string>(`cinemas:${cid}`) : undefined;
  if (cachedData) {
    return okResp(cachedData);
  }
  const data = await getCinemaApi({ ...defApiOpt, log: Log(`cinemas.handler.${cid}`) });
  await setCache(`cinemas:${cid}`, data, hourSec);
  return okResp(data);
};

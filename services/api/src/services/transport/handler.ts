// import { defTransportRoutesIds, getTransportApi, Log } from '@kremen/core';
// import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
// import { cacheWithRootKey } from 'core/cache';
// import {
//   daySec,
//   HttpReqParams,
//   isCacheEnabled,
//   notFoundResp,
//   okResp,
//   paramMissedResp,
//   paramWrongFormatResp,
//   parseIdsStr,
//   requestHttpReqHandler,
//   serverErrResp,
//   strToLatLng,
// } from 'utils';

// const log = Log('transport.handler');

// // Cache
// const {
//   env: { NODE_ENV },
// } = process;
// const cacheRootKey = `kremen:transport:${NODE_ENV}`;
// const { getCache, setCache } = cacheWithRootKey(cacheRootKey);

// const api = getTransportApi({ reqHandler: requestHttpReqHandler, log }).withCity();

// export const handler: APIGatewayProxyHandler = async event => {
//   log.trace('event=', event);
//   log.start(`resource ${event.resource}`);
//   const res = await processEvent(event);
//   log.end(`resource ${event.resource}`);
//   return res;
// };

// interface HandlerOpt {
//   pathParams: HttpReqParams;
//   queryParams: HttpReqParams;
//   cache: boolean;
// }

// const processEvent = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   const { resource, pathParameters: pathParams, queryStringParameters: queryParams } = event;
//   const cache = isCacheEnabled(queryParams);
//   log.debug('cache=', cache);
//   const opts: HandlerOpt = {
//     pathParams: pathParams ? pathParams : {},
//     queryParams: queryParams ? queryParams : {},
//     cache,
//   };
//   try {
//     if (resource === '/transport/routes') {
//       return handleRoutes(opts);
//     }
//     if (resource === '/transport/find') {
//       return handleFind(opts);
//     }
//     if (resource === '/transport/buses') {
//       return handleBuses(opts);
//     }
//     if (resource === '/transport/buses/update') {
//       return handleBusesUpdate(opts);
//     }
//     if (resource === '/transport/stations') {
//       return handleStations(opts);
//     }
//     if (resource === '/transport/stations/{id}/prediction') {
//       return handleStationPrediction(opts);
//     }
//     if (resource === '/transport/routes/{id}/buses') {
//       return handleRoutesBuses(opts);
//     }
//     if (resource === '/transport/routes/{id}/stations') {
//       return handleRoutesStations(opts);
//     }
//     return notFoundResp(`${resource} not found`);
//   } catch (err) {
//     log.err(err);
//     return serverErrResp(err.message);
//   }
// };

// const handleRoutes = async ({ cache }: HandlerOpt) => {
//   const cacheKey = 'routes';
//   const cacheData = cache ? await getCache(cacheKey) : undefined;
//   if (cacheData) {
//     log.debug('found data in cache');
//     return okResp(cacheData, true);
//   }
//   const [routes, stations] = await Promise.all([api.getRoutes(), api.getRoutesStations(defTransportRoutesIds)]);
//   const data = routes.map(route => {
//     const routeStations = stations.filter(({ rid }) => rid === route.rid);
//     return { ...route, stations: routeStations };
//   });
//   await setCache(cacheKey, data, daySec);
//   return okResp(data);
// };

// const handleFind = async ({ queryParams }: HandlerOpt) => {
//   if (!queryParams) {
//     return paramMissedResp('from');
//   }
//   const { from: fromStr, to: toStr } = queryParams;
//   if (!fromStr) {
//     return paramMissedResp('from');
//   }
//   const from = strToLatLng(fromStr);
//   if (!from) {
//     return paramWrongFormatResp('from');
//   }
//   if (!toStr) {
//     return paramMissedResp('to');
//   }
//   const to = strToLatLng(toStr);
//   if (!to) {
//     return paramWrongFormatResp('to');
//   }
//   const data = await api.findRoute(from, to);
//   return okResp(data);
// };

// const handleRoutesBuses = async ({ pathParams }: HandlerOpt) => {
//   if (!pathParams.id) {
//     return paramMissedResp('id');
//   }
//   const id = parseInt(pathParams.id, 10);
//   if (isNaN(id)) {
//     return paramWrongFormatResp('id');
//   }
//   const data = await api.getRouteBuses(id);
//   return okResp(data);
// };

// const handleRoutesStations = async ({ pathParams }: HandlerOpt) => {
//   if (!pathParams.id) {
//     return paramMissedResp('id');
//   }
//   const id = parseInt(pathParams.id, 10);
//   if (isNaN(id)) {
//     return paramWrongFormatResp('id');
//   }
//   return okResp(await api.getRouteStations(id));
// };

// const handleBuses = async ({ queryParams }: HandlerOpt) => {
//   const rids = queryParams.rids ? parseIdsStr(queryParams.rids) : defTransportRoutesIds;
//   const data = await api.getRoutesBuses(rids);
//   return okResp(data);
// };

// const handleBusesUpdate = async ({ queryParams }: HandlerOpt) => {
//   const rids = queryParams.rids ? parseIdsStr(queryParams.rids) : defTransportRoutesIds;
//   const data = await api.getRoutesBusesUpdate(rids);
//   return okResp(data);
// };

// const handleStations = async ({ cache, queryParams }: HandlerOpt) => {
//   const rids = queryParams.rids ? parseIdsStr(queryParams.rids) : defTransportRoutesIds;
//   const cacheKey = `stations:${JSON.stringify(rids)}`;
//   const cacheData = cache ? await getCache(cacheKey) : undefined;
//   if (cacheData) {
//     log.debug('found data in cache');
//     return okResp(cacheData, true);
//   }
//   const data = await api.getRoutesStations(rids);
//   await setCache(cacheKey, data, daySec);
//   return okResp(data);
// };

// const handleStationPrediction = async ({ pathParams }: HandlerOpt) => {
//   if (!pathParams.id) {
//     return paramMissedResp('id');
//   }
//   const id = parseInt(pathParams.id, 10);
//   if (isNaN(id)) {
//     return paramWrongFormatResp('id');
//   }
//   return okResp(await api.getStationPrediction(id));
// };

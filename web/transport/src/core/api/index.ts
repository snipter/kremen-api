import axios from 'axios';
import { genRandId, Log, numbersArrToStr } from 'utils';

import {
  TransportBus,
  TransportBusesCompactUpdate,
  TransportPrediction,
  TransportRoute,
  TransportStation,
} from './types';
import { ApiReqOpt, getErrFromResp } from './utils';

const log = Log('core.api');

const getApiRoot = () => {
  switch (ENV) {
    case 'loc':
      return 'http://localhost:8080';
    default:
      return 'https://api.kremen.dev';
  }
};

const getApi = () => {
  const apiRoot = getApiRoot();

  const apiReq = async <T>(opt: ApiReqOpt): Promise<T> => {
    const { path, method = 'get', params } = opt;
    const reqUrl = `${apiRoot}/${path}`;
    const id = genRandId(5);
    const msg = `req id=${id}, method=${method}, path=${path}, params=${JSON.stringify(params)}`;
    log.debug(msg);
    log.start(msg);
    const resp = await axios({ method, url: reqUrl, params });
    log.end(msg);
    log.debug(`${msg} done`);
    const { status } = resp;
    const data = (resp.data as unknown) as T;
    const err = getErrFromResp(status, data);
    if (err) {
      throw err;
    }
    return data;
  };

  return {
    transport: {
      routes: async (): Promise<TransportRoute[]> => apiReq<TransportRoute[]>({ path: `transport/routes` }),
      stations: async (): Promise<TransportStation[]> => apiReq<TransportStation[]>({ path: `transport/stations` }),
      stationPrediction: async (sid: number): Promise<TransportPrediction[]> =>
        apiReq<TransportPrediction[]>({ path: `transport/stations/${sid}/prediction` }),
      buses: async (): Promise<TransportBus[]> => apiReq<TransportBus[]>({ path: `transport/buses` }),
      busesUpdate: async (routesIds?: number[]): Promise<TransportBusesCompactUpdate> => {
        const params = routesIds ? { rids: numbersArrToStr(routesIds) } : undefined;
        return apiReq<TransportBusesCompactUpdate>({ path: `transport/buses/update`, params });
      },
    },
  };

  // Request / Response processing
};

export const api = getApi();

export * from './types';

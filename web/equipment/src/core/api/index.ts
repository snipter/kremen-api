import { EquipmentMachine } from '@kremen/types';
import axios from 'axios';
import { genRandId, Log } from 'utils';

import { ApiReqOpt, getErrFromResp } from './utils';

const log = Log('core.api');

export const getApiRoot = () => {
  switch (ENV) {
    case 'loc':
      return {
        api: 'http://localhost:8080',
        ws: 'ws://localhost:8080',
      };
    default:
      return {
        api: 'https://api.kremen.dev',
        ws: 'wss://api.kremen.dev',
      };
  }
};

const getApi = () => {
  const apiRoot = getApiRoot().api;

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
    equipment: {
      list: async (): Promise<EquipmentMachine[]> => apiReq<EquipmentMachine[]>({ path: `equipment` }),
    },
  };
};

export const api = getApi();

export * from '@kremen/types';

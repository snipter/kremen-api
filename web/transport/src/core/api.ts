import { getKremenApi, HttpReqHandler, HttpReqOpt, HttpReqResp, Log } from '@kremen/core';
import axios from 'axios';

const log = Log('core.api');

const apiRoot =
  ENV === 'dev'
    ? `https://ewom32k72a.execute-api.us-east-1.amazonaws.com/dev`
    : `https://h86f4vhg7h.execute-api.us-east-1.amazonaws.com/prod`;

const axiosHttpReqHandler: HttpReqHandler = async <T>({
  method = 'get',
  url,
  qs,
  timeout,
}: HttpReqOpt): Promise<HttpReqResp<T>> => {
  const { data, status } = await axios({ method, url, params: qs, timeout });
  return { body: (data as unknown) as T, status };
};

export const api = getKremenApi({ reqHandler: axiosHttpReqHandler, url: apiRoot, log });

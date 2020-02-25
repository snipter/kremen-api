import request, { CoreOptions, Response, UriOptions, UrlOptions } from 'request';
import { HttpReqHandler, HttpReqOpt, HttpReqResp } from '@kremen/core';

type ReqOpt = (UriOptions & CoreOptions) | (UrlOptions & CoreOptions);

export interface HttpReqParams {
  [key: string]: string;
}

export const asyncReq = <T = any>(opt: ReqOpt): Promise<{ res: Response; body: T }> =>
  new Promise((resolve, reject) => {
    request(opt, (err, res, body) => {
      if (err) {
        reject({ name: 'HTTP_REQ_ERR', descr: err.toString() });
      } else {
        if (res.statusCode > 299) {
          const name = 'HTTP_WRONG_STATUS_CODE';
          const descr = res.statusCode + (body ? ': ' + body : '');
          reject({ code: res.statusCode, name, descr });
        } else {
          resolve({ res, body });
        }
      }
    });
  });

export const requestHttpReqHandler: HttpReqHandler = <T>({
  url,
  qs,
  json,
  timeout,
}: HttpReqOpt): Promise<HttpReqResp<T>> =>
  new Promise((resolve, reject) => {
    request({ url, qs, json, timeout }, (err, res, body) => {
      if (err) {
        return reject(err);
      }
      const { statusCode } = res;
      resolve({ status: statusCode, body });
    });
  });

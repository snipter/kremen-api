import { HttpReqHandler, HttpReqOpt, HttpReqResp } from '@kremen/core';
import iconv from 'iconv-lite';
import { isBuffer, isString } from 'lodash';
import request from 'request';

export interface HttpReqParams {
  [key: string]: string;
}

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
      if (!isString(body)) {
        return resolve({ status: statusCode, body });
      }
      const encoding = getEncodingFromHtml(body);
      if (!encoding) {
        return resolve({ status: statusCode, body: (body as unknown) as T });
      }
      try {
        const decodeRes = iconv.decode((body as unknown) as Buffer, encoding);
        const decodeBody = isBuffer(decodeRes) ? decodeRes.toString() : decodeRes;
        return resolve({ status: statusCode, body: (decodeBody as unknown) as T });
      } catch (e) {
        return reject({ name: 'ENCODING_CONVERSION_ERR', descr: url });
      }
    });
  });

const getEncodingFromHtml = (body: string): string | undefined => {
  const encodingReg = /<meta charset="([\w-]+)"[/\s]+?>/g;
  const match = encodingReg.exec(body);
  if (!match) {
    return undefined;
  }
  const encodingStr = match[1].toLowerCase().trim();
  if (encodingStr === 'windows-1251') {
    return 'cp1251';
  }
  return encodingStr;
};

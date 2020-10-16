import axios from 'axios';
import { compact, isString, rest } from 'lodash';
import { Response } from 'express';

export interface HttpReqQs {
  [key: string]: undefined | string | number;
}

export const getHtmlWithUrl = async (url: string): Promise<string> => {
  const { data, status } = await axios.get<unknown>(url);
  if (!isStatus200(status)) {
    throw new Error(`wrong status code=${status}`);
  }
  if (!isString(data)) {
    throw new Error(`response data is not a string`);
  }
  return data;
};

const isStatus200 = (status: number) => status >= 200 && status < 300;

// Params

export const parseIdsStr = (val: string): number[] =>
  compact(
    val.split(',').map(item => {
      const val = parseInt(item, 10);
      return isNaN(val) ? undefined : val;
    }),
  );

// Responses

export const okResp = <T = any>(res: Response, data: T) => res.status(200).json(data);

export const serverErrResp = (res: Response, error: string) => res.status(503).json({ error });

export const notFoundResp = (res: Response, data?: string) => res.status(404).json({ error: data || '' });

export const paramMissedResp = (res: Response, paramName: string) =>
  res.status(422).json({ error: `"${paramName}" param missed` });

export const paramWrongFormatResp = (res: Response, paramName: string) =>
  res.status(422).json({ error: `Wrong "${paramName}" format` });

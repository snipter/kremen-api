import { keys, reduce } from 'lodash';

export interface IHTTPQueryParams {
  [key: string]: string | number;
}

export const qsParamsToStr = (params: IHTTPQueryParams): string => (
  reduce(keys(params), (memo, key) => (
    memo ? `${memo}&${key}=${params[key]}` : `${key}=${params[key]}`
  ), '')
);

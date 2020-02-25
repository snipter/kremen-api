import { isString, isNumber, isDate, isError, isFunction } from 'lodash';
import { LatLng } from '@kremen/core';

export const anyToStr = (val: any): string => {
  if (val === undefined) {
    return 'undefined';
  }
  if (val === null) {
    return 'null';
  }
  if (isString(val)) {
    return val;
  }
  if (isNumber(val)) {
    return `${val}`;
  }
  if (isDate(val) || isError(val) || isFunction(val.toString)) {
    return val.toString();
  }
  if (!val) {
    return '';
  }
  return '';
};

export const strToLatLng = (val: string): LatLng | undefined => {
  if (!val) {
    return undefined;
  }
  const parts = val.split(',');
  if (parts.length !== 2) return undefined;
  const lat = parseFloat(parts[0]);
  if (isNaN(lat)) {
    return undefined;
  }
  const lng = parseFloat(parts[1]);
  if (isNaN(lng)) {
    return undefined;
  }
  return { lat, lng };
};

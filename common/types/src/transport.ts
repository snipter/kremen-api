import { isArray, isNumber, isString } from 'lodash';
import { isUnknowDict } from './basic';

export enum TransportCountry {
  KZ = 1,
  RU = 2,
  UA = 3,
}

export enum TransportCity {
  Kremenchuk = 10,
}

export enum TransportType {
  Bus = 'B',
  Trolleybus = 'T',
}

export interface TransportStation {
  sid: number;
  rid: number;
  lat: number;
  lng: number;
  name: string;
  sequenceNumber: number;
  directionForward: boolean;
}

export interface TransportRoute {
  rid: number;
  path: number[][];
  active: number;
  type: TransportType;
  name: string;
  number: string;
  stations: TransportStation[];
  color?: string;
}

export interface TransportBus {
  tid: string;
  rid: number;
  type: TransportType;
  direction: number;
  invalidAdapted: boolean;
  lat: number;
  lng: number;
  name: string;
  offline: boolean;
  speed: number;
}

export const isTransportBus = (val: unknown): val is TransportBus =>
  isUnknowDict(val) &&
  isString(val.tid) &&
  isNumber(val.rid) &&
  isString(val.type) &&
  isNumber(val.direction) &&
  isNumber(val.lat) &&
  isNumber(val.lng) &&
  isNumber(val.speed);

export const isTransportBuses = (val: unknown): val is TransportBus[] =>
  isArray(val) && val.reduce((memo, itm) => memo && isTransportBus(itm), true);

export interface TransportBusesCompactUpdate {
  [id: string]: number[];
}

export interface TransportPrediction {
  rid: number;
  sid: number;
  tid: string;
  reverse: boolean;
  distance: number;
  prediction: number;
  generatedTime: number;
  messageTime: number;
  avgSpeed: number;
  speed: number;
  mainPrediction: boolean;
}

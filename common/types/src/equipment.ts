import { isArray, isNumber, isString } from 'lodash';

import { isUnknowDict } from './basic';

export interface EquipmentMachine {
  eid: string;
  lat: number;
  lng: number;
  name?: string;
  company?: string;
  type?: EquipmentMachineType;
  speed: number;
  modTs: number;
}

export const isEqipmentMachine = (val: unknown): val is EquipmentMachine =>
  isUnknowDict(val) &&
  isString(val.eid) &&
  isNumber(val.lat) &&
  isNumber(val.lng) &&
  isNumber(val.speed) &&
  isNumber(val.modTs);

export const isEqipmentMachines = (val: unknown): val is EquipmentMachine[] =>
  isArray(val) && val.reduce((memo, itm) => memo && isEqipmentMachine(itm), true);

export enum EquipmentMachineType {
  Tractor = 'TR',
  Sweeper = 'SW',
  Spreader = 'SP',
  GarbageTruck = 'GT',
  Unknow = 'UN',
}

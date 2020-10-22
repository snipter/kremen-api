import { LatLng } from 'utils';

export interface EquipmentTimer {
  name: string;
  val: number;
}

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

export interface EquipmentMachinesList {
  [key: string]: EquipmentMachine;
}

export enum EquipmentMachineType {
  Tractor = 'TR',
  Sweeper = 'SW',
  Spreader = 'SP',
  GarbageTruck = 'GT',
  Unknow = 'UN',
}

export type EquipmentTrackingRecord = LatLng;

// Requests

export interface EquipmentListRes {
  equipment: EquipmentMachine[];
  system: {
    sid?: string;
    timer: EquipmentTimer;
  };
}

export interface EquipmentReqWithTimerRes {
  timer: EquipmentTimer;
  equipment: EquipmentMachine[];
}

// Parsing

export interface EquipmentParseTickRes {
  data: EquipmentParseTickData;
  errs?: string[];
  warns?: string[];
}

export interface EquipmentParseTickData {
  equipment: EquipmentMachine[];
}

export interface EquipmentParseMachineRes {
  data?: EquipmentParseMachineData;
  errs?: string[];
  warns?: string[];
}

export interface EquipmentParseMachineData {
  name?: string;
  company?: string;
  group?: string;
  speed?: string;
  time?: string;
}

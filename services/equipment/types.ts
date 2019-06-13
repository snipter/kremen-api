export interface IEquipTimer {
  name: string;
  val: number;
}

export interface IEquipMachine {
  eid: string;
  lat: number;
  lng: number;
  name: string | null;
  company: string | null;
  group: EquipMachineType | null;
  speed: number;
  mod: number;
}

export enum EquipMachineType {
  Tractor = 'TR',
  Sweeper = 'SW',
  Spreader = 'SP',
  GarbageTruck = 'GT',
  Unknow = 'UN',
}

export interface IEuipDataResp {
  equipment: IEquipMachine[];
  system: {
    sid: string | null;
    timer: IEquipTimer;
  };
}

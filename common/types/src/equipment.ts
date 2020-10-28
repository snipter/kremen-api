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

export enum EquipmentMachineType {
  Tractor = 'TR',
  Sweeper = 'SW',
  Spreader = 'SP',
  GarbageTruck = 'GT',
  Unknow = 'UN',
}

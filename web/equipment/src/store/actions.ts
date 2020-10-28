import { EquipmentMachine } from 'core/api';
import { Action } from 'redux';

export enum ActionType {
  EquipmentItemsSet = 'equipment/ItemsSet',
  EquipmentItemsMod = 'equipment/ItemsMod',
}

export type StoreAction =
  | (Action<ActionType.EquipmentItemsSet> & { items: EquipmentMachine[] })
  | (Action<ActionType.EquipmentItemsMod> & { data: Partial<EquipmentMachine>[] });

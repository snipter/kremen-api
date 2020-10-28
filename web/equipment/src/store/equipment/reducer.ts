import { EquipmentMachine } from 'core/api';
import { isArray } from 'lodash';
import { ActionType, StoreAction } from 'store/actions';
import defItems from './items.json';

export interface EquipmentState {
  items: EquipmentMachine[];
}

const initial: EquipmentState = {
  items: isArray(defItems) ? ((defItems as unknown) as EquipmentMachine[]) : [],
};

export const reducer = (state: EquipmentState = initial, action: StoreAction): EquipmentState => {
  switch (action.type) {
    case ActionType.EquipmentItemsSet: {
      const { items } = action;
      return { ...state, items };
    }
    case ActionType.EquipmentItemsMod: {
      const { data } = action;
      const items = state.items.map(itm => {
        const update = data.find(uitem => uitem.eid === itm.eid);
        return update ? { ...itm, ...update } : itm;
      });
      return { ...state, items };
    }
    default:
      return state;
  }
};

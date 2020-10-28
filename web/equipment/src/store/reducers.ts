import { ReducersMapObject } from 'redux';
import { StoreAction } from './actions';
import { reducer as equipment } from './equipment/reducer';

export interface StoreState {
  equipment: ReturnType<typeof equipment>;
}

export const reducers: ReducersMapObject<StoreState, StoreAction> = {
  equipment,
};

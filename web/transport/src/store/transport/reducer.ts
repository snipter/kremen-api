import { TransportBus, TransportRoute } from 'core/api';
import { ActionType, StoreAction } from 'store/actions';

import initRoutes from './routes.json';

export interface TransportState {
  routes: TransportRoute[];
  buses: TransportBus[];
}

const getInitState = (): TransportState => {
  const routes = initRoutes ? initRoutes : [];
  return { routes, buses: [] };
};

const initial: TransportState = getInitState();

export const reducer = (state: TransportState = initial, action: StoreAction): TransportState => {
  switch (action.type) {
    case ActionType.TransportRoutesSet: {
      const { routes } = action;
      return { ...state, routes };
    }
    case ActionType.TransportBusesSet: {
      const { buses } = action;
      return { ...state, buses };
    }
    case ActionType.TransportBusesMod: {
      const { data } = action;
      const buses = state.buses.map(itm => {
        const update = data.find(uitem => uitem.tid === itm.tid);
        return update ? { ...itm, ...update } : itm;
      });
      return { ...state, buses };
    }
    default:
      return state;
  }
};

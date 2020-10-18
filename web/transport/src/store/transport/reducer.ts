import { TransportBus, TransportRoute } from 'core/api';
import { ActionType, StoreAction } from 'store/actions';

import initRoutes from './routes.json';
import initBuses from './buses.json';

export interface TransportState {
  routes: TransportRoute[];
  buses: TransportBus[];
}

const getInitState = (): TransportState => {
  const routes = initRoutes ? initRoutes : [];
  const buses = initBuses ? initBuses : [];
  return { routes, buses };
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
    case ActionType.TransportBusesCompactUpdate: {
      const { update } = action;
      const buses = state.buses.map(bus => {
        if (!update[bus.tid]) {
          return bus;
        }
        const [lat, lng, direction, speed, offlineNum] = update[bus.tid];
        const offline = offlineNum === 1 ? true : false;
        return { ...bus, lat, lng, direction, speed, offline };
      });
      return { ...state, buses };
    }
    default:
      return state;
  }
};

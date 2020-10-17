import { ActionType, StoreAction } from 'store/actions';
import { TransportRoute, TransportBus } from '@kremen/core';
import initData from './init.json';

export interface TransportState {
  routes: TransportRoute[];
  buses: TransportBus[];
}

const getInitState = (): TransportState => {
  if (!initData) {
    return { routes: [], buses: [] };
  }
  const routes = initData.routes ? initData.routes : [];
  const buses = initData.buses ? initData.buses : [];
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

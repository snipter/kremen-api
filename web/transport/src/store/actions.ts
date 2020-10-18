import { TransportBus, TransportBusesCompactUpdate, TransportRoute } from 'core/api';
import { Action } from 'redux';

export enum ActionType {
  TransportRoutesSet = 'transport/RoutesSet',
  TransportBusesSet = 'transport/BusesSet',
  TransportBusesCompactUpdate = 'transport/BusesUpdate',
}

export type StoreAction =
  | (Action<ActionType.TransportRoutesSet> & { routes: TransportRoute[] })
  | (Action<ActionType.TransportBusesSet> & { buses: TransportBus[] })
  | (Action<ActionType.TransportBusesCompactUpdate> & { update: TransportBusesCompactUpdate });

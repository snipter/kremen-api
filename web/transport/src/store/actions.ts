import { TransportBus, TransportBusesCompactUpdate, TransportRoute } from 'core/api';
import { Action } from 'redux';

export enum ActionType {
  TransportRoutesSet = 'transport/RoutesSet',
  TransportBusesSet = 'transport/BusesSet',
  TransportBusesMod = 'transport/BusesMod',
  TransportBusesCompactUpdate = 'transport/BusesUpdate',
}

export type StoreAction =
  | (Action<ActionType.TransportRoutesSet> & { routes: TransportRoute[] })
  | (Action<ActionType.TransportBusesSet> & { buses: TransportBus[] })
  | (Action<ActionType.TransportBusesMod> & { data: Partial<TransportBus>[] })
  | (Action<ActionType.TransportBusesCompactUpdate> & { update: TransportBusesCompactUpdate });

import { TransportBus, TransportBusesCompactUpdate, TransportRoute } from '@kremen/core';
import { Action } from 'redux';

export enum ActionType {
  TransportRoutesSet = 'transport/routes/set',
  TransportBusesSet = 'transport/buses/set',
  TransportBusesCompactUpdate = 'transport/buses/update',
}

export type StoreAction =
  | (Action<ActionType.TransportRoutesSet> & { routes: TransportRoute[] })
  | (Action<ActionType.TransportBusesSet> & { buses: TransportBus[] })
  | (Action<ActionType.TransportBusesCompactUpdate> & { update: TransportBusesCompactUpdate });

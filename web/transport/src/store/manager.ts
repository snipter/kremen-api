import { api, defRouteColors, routeNumberToColor, sortRoutes, TransportRoute } from 'core';
import { Store } from 'redux';
import { PersistedState } from 'redux-persist';
import { Log } from 'utils';

import { ActionType, StoreAction } from './actions';
import { StoreState } from './reducers';

const log = Log('store.SateManager');

export class SateManager {
  private store: Store<StoreState & PersistedState>;

  constructor(store: Store<StoreState & PersistedState>) {
    this.store = store;
    store.subscribe(this.onStoreChange);
  }

  public get state() {
    return this.store.getState();
  }

  public dispatch(action: StoreAction) {
    return this.store.dispatch(action);
  }

  private onStoreChange = () => {
    //
  };

  // Transport

  public routeWithId(rid: number): TransportRoute | undefined {
    return this.state.transport.routes.find(item => item.rid === rid);
  }

  public transportRoutes(): TransportRoute[] {
    return sortRoutes(this.state.transport.routes);
  }

  public async transportDataUpdate() {
    return Promise.all([this.transportRoutesUpdate(), this.transportBusesUpdate()]);
  }

  public async transportRoutesUpdate() {
    log.debug('getting routes');
    log.start('getRoutes');
    const routes = await api.transport.routes();
    log.end('getRoutes');
    log.debug('getting routes done');
    this.dispatch({ type: ActionType.TransportRoutesSet, routes });
  }

  public async transportBusesUpdate() {
    log.debug('getting buses');
    log.start('getBuses');
    const buses = await api.transport.buses();
    log.end('getBuses');
    log.debug('getting buses done');
    this.dispatch({ type: ActionType.TransportBusesSet, buses });
  }

  public async transportBusesUpdateState(routesIds?: number[]) {
    log.debug('getting buses update');
    log.start('getBusesUpdate');
    const update = await api.transport.busesUpdate(routesIds);
    log.end('getBusesUpdate');
    log.debug('getting buses done');
    this.dispatch({ type: ActionType.TransportBusesCompactUpdate, update });
  }

  public routeToColors(route?: TransportRoute) {
    if (!route) {
      return defRouteColors;
    }
    return routeNumberToColor(route.number);
  }

  public routeIdToColors(rid: number) {
    const route = this.state.transport.routes.find(item => item.rid === rid);
    if (!route) {
      return defRouteColors;
    }
    return this.routeToColors(route);
  }
}

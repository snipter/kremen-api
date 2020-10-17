import { createStore, ReducersMapObject } from 'redux';
import { persistCombineReducers, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { SateManager } from './manager';
import { StoreState, reducers } from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

const persistConfig = {
  key: 'store:v1',
  storage,
};

const persistedReducer = persistCombineReducers<StoreState>(persistConfig, reducers as ReducersMapObject<StoreState>);

export const store = createStore(persistedReducer, composeWithDevTools());
export const manager = new SateManager(store);
export const persistor = persistStore(store);
// persistor.purge(); // { type: 'persist/PURGE' }
export { StoreAction, ActionType } from './actions';
export { StoreState } from './reducers';
export * from './selectors';

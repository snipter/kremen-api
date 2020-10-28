import { createStore, ReducersMapObject } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistCombineReducers, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { reducers, StoreState } from './reducers';

const persistConfig = {
  key: 'store:v1',
  storage,
};

const persistedReducer = persistCombineReducers<StoreState>(persistConfig, reducers as ReducersMapObject<StoreState>);

export const store = createStore(persistedReducer, composeWithDevTools());
export const persistor = persistStore(store);
// persistor.purge(); // { type: 'persist/PURGE' }
export { StoreAction, ActionType } from './actions';
export { StoreState } from './reducers';
export * from './manager';
export * from './utils';

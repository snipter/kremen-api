import { api, EquipmentMachine } from 'core';
import { Dispatch } from 'react';
import { useDispatch } from 'react-redux';
import { Log } from 'utils';

import { ActionType, StoreAction } from './actions';

const log = Log('store.manager');

export const useStoreManager = () => {
  const dispatch = useDispatch<Dispatch<StoreAction>>();

  const updateItems = async () => {
    log.debug('getting items');
    log.start('getItems');
    const items = await api.equipment.list();
    log.end('getItems');
    log.debug('getting items done');
    dispatch({ type: ActionType.EquipmentItemsSet, items });
  };

  const modItems = (data: Partial<EquipmentMachine>[]) => dispatch({ type: ActionType.EquipmentItemsMod, data });

  return {
    updateItems,
    modItems,
  };
};

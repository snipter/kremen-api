import { EquipmentMachine, isEqipmentMachines } from '@kremen/types';
import axios from 'axios';
import { WatcherOpt } from 'core';
import { compact, identity, pickBy } from 'lodash';
import { Log } from 'utils';
import WebSocket from 'ws';

import { getEquipmentMachineDiff } from './utils';

const log = Log('wss.equipment');

const getItems = async (apiRoot: string): Promise<EquipmentMachine[]> => {
  log.debug('getting items');
  const { status, data } = await axios(`${apiRoot}/equipment`);
  if (status < 200 || status > 299) {
    throw new Error(`Wrong response status: ${status}`);
  }
  if (!isEqipmentMachines(data)) {
    throw new Error(`Wrong returned data format`);
  }
  log.debug('getting items done');
  return data;
};

export const initEquipmentWatcher = ({ apiRoot, wss, db }: WatcherOpt) => {
  // WSS

  wss.on('connection', () => {
    log.debug('new connection');
  });

  const wssProcessChanged = (data: Partial<EquipmentMachine>[]) => {
    wss.clients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'items', data }));
      }
    });
  };

  // Mongo

  const logCollection = db.collection('equipmentLog');

  const mongoProcessChanged = (items: Partial<EquipmentMachine>[]) => {
    const ts = new Date().getTime();
    const records = compact(items.map(itm => itemDataToMongoLogRec(itm, ts)));
    if (!records.length) {
      return;
    }
    log.debug(`adding new log records, count=`, records.length);
    logCollection.insertMany(records, err => {
      if (err) {
        log.err(`adding new log records err, msg=`, err.message);
      }
    });
  };

  const itemDataToMongoLogRec = (item: Partial<EquipmentMachine>, ts: number) => {
    if (!item.eid) {
      return undefined;
    }
    const { eid, lat, lng, speed } = item;
    type Record = Partial<Pick<EquipmentMachine, 'eid' | 'lat' | 'lng' | 'speed'>> & { ts: number };
    const data: Record = { eid, ts };
    if (lat) {
      data.lat = lat;
    }
    if (lng) {
      data.lng = lng;
    }
    if (speed) {
      data.speed = speed;
    }
    return data;
  };

  // Processing

  setInterval(() => {
    processItemsUpdate();
  }, 10000);

  let prevItems: EquipmentMachine[] = [];

  const processItemsUpdate = async () => {
    try {
      log.debug('processing items start');
      const newItems = await getItems(apiRoot);
      const diff = getEquipmentMachineDiff(prevItems, newItems);
      if (diff.length) {
        log.debug(`items changed, count=`, diff.length);
        wssProcessChanged(diff);
        mongoProcessChanged(diff);
      }
      prevItems = newItems;
      log.debug('processing items end');
    } catch (err) {
      log.err('processing items err=', err.message);
    }
  };
};

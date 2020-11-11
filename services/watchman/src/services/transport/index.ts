import { isTransportBuses, TransportBus } from '@kremen/types';
import axios from 'axios';
import { WatcherOpt } from 'core';
import { compact } from 'lodash';
import { Log } from 'utils';
import WebSocket from 'ws';

import { getBusesDiff } from './utils';

const log = Log('wss.tranposrt');

const getBuses = async (apiRoot: string) => {
  log.debug('getting buses info');
  const { status, data } = await axios(`${apiRoot}/transport/buses`);
  if (status < 200 || status > 299) {
    throw new Error(`Wrong response status: ${status}`);
  }
  if (!isTransportBuses(data)) {
    throw new Error(`Wrong returned data format`);
  }
  log.debug('getting buses info done');
  return data;
};

export const initTransprotWatcher = ({ apiRoot, wss, db }: WatcherOpt) => {
  // WSS

  wss.on('connection', () => {
    log.debug('new connection');
  });

  const wssProcessChanged = (data: Partial<TransportBus>[]) => {
    wss.clients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'buses', data }));
      }
    });
  };

  // Mongo

  const logCollection = db.collection('transportLog');

  const mongoProcessChanged = (items: Partial<TransportBus>[]) => {
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

  const itemDataToMongoLogRec = (item: Partial<TransportBus>, ts: number) => {
    if (!item.tid) {
      return undefined;
    }
    const { tid, lat, lng, speed, direction } = item;
    type Record = Partial<Pick<TransportBus, 'tid' | 'lat' | 'lng' | 'speed' | 'direction'>> & { ts: number };
    const data: Record = { tid, ts };
    if (lat) {
      data.lat = lat;
    }
    if (lng) {
      data.lng = lng;
    }
    if (speed) {
      data.speed = speed;
    }
    if (direction) {
      data.direction = direction;
    }
    return data;
  };

  // Processing

  setInterval(() => {
    processBusesUpdate();
  }, 5000);

  let prevBuses: TransportBus[] = [];

  const processBusesUpdate = async () => {
    try {
      log.debug('processing buses start');
      const newBuses = await getBuses(apiRoot);
      const diff = getBusesDiff(prevBuses, newBuses);
      if (diff.length) {
        log.debug(`busses changed, count=`, diff.length);
        wssProcessChanged(diff);
        mongoProcessChanged(diff);
      }
      prevBuses = newBuses;
      log.debug('processing buses end');
    } catch (err) {
      log.err('processing buses err=', err);
    }
  };
};

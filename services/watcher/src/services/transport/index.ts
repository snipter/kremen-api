import { isTransportBuses, TransportBus } from '@kremen/types';
import axios from 'axios';
import { Log, NodeEnv } from 'utils';
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

const envToApiRoot = (env: NodeEnv) => {
  switch (env) {
    case 'dev':
      return 'https://api.kremen.dev';
    case 'loc':
      return 'http://localhost:8080';
    case 'prd':
      return 'http://api:8080';
  }
};

export const getTransportWss = (env: NodeEnv = 'prd') => {
  const apiRoot = envToApiRoot(env);
  const wss = new WebSocket.Server({ noServer: true });

  wss.on('connection', () => {
    log.debug('new connection');
  });

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
        log.debug(`${diff.length} buses changed`);
        wss.clients.forEach(ws => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'buses', data: diff }));
          }
        });
      }
      prevBuses = newBuses;
      log.debug('processing buses end');
    } catch (err) {
      log.err('processing buses err=', err);
    }
  };

  return wss;
};

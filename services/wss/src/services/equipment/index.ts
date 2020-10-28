import { EquipmentMachine, isEqipmentMachines } from '@kremen/types';
import axios from 'axios';
import { Log, NodeEnv } from 'utils';
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

export const getEquipmentWss = (env: NodeEnv = 'prd') => {
  const apiRoot = envToApiRoot(env);
  const wss = new WebSocket.Server({ noServer: true });

  wss.on('connection', () => {
    log.debug('new connection');
  });

  setInterval(() => {
    processItemsUpdate();
  }, 5000);

  let prevItems: EquipmentMachine[] = [];

  const processItemsUpdate = async () => {
    try {
      log.debug('processing items start');
      const newItems = await getItems(apiRoot);
      const diff = getEquipmentMachineDiff(prevItems, newItems);
      if (diff.length) {
        log.debug(`${diff.length} items changed`);
        wss.clients.forEach(ws => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'items', data: diff }));
          }
        });
      }
      prevItems = newItems;
      log.debug('processing items end');
    } catch (err) {
      log.err('processing items err=', err.message);
    }
  };

  return wss;
};

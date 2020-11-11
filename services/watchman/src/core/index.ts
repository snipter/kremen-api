import { Db } from 'mongodb';
import { NodeEnv } from 'utils';
import WebSocket from 'ws';

export interface WatcherOpt {
  apiRoot: string;
  wss: WebSocket.Server;
  db: Db;
}

export const envToApiRoot = (env: NodeEnv) => {
  switch (env) {
    case 'dev':
      return 'https://api.kremen.dev';
    case 'loc':
      return 'http://localhost:8080';
    case 'prd':
      return 'http://api:8080';
  }
};

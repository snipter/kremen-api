import { envToApiRoot } from 'core';
import http from 'http';
import { Db, MongoClient } from 'mongodb';
import { initEquipmentWatcher, initTransprotWatcher } from 'services';
import url from 'url';
import { getEnvPort, getNodeEnv, Log } from 'utils';
import WebSocket from 'ws';

const log = Log('watcher');

const port = getEnvPort();
const env = getNodeEnv();

// DB

const initMongoClient = (cb: (db: Db) => void) => {
  const mognoUrl = 'mongodb://mongo:27017';
  log.info(`connecting to mongo, url=${mognoUrl}`);
  MongoClient.connect(mognoUrl, (err, client) => {
    if (err) {
      log.info('connecting to mongo err=', err.message);
      process.exit(1);
    }
    log.info(`connecting to mongo done`);
    const db = client.db('kremen');
    cb(db);
  });
};

// WSS

const server = http.createServer();
const apiRoot = envToApiRoot(env);

initMongoClient(db => {
  const wssTransport = new WebSocket.Server({ noServer: true });
  initTransprotWatcher({ apiRoot, wss: wssTransport, db });

  const wssEqipment = new WebSocket.Server({ noServer: true });
  initEquipmentWatcher({ apiRoot, wss: wssEqipment, db });

  server.on('upgrade', (request, socket, head) => {
    const pathname = url.parse(request.url).pathname;

    if (pathname === '/transport/realtime') {
      wssTransport.handleUpgrade(request, socket, head, ws => {
        wssTransport.emit('connection', ws, request);
      });
    } else if (pathname === '/equipment/realtime') {
      wssEqipment.handleUpgrade(request, socket, head, ws => {
        wssEqipment.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  log.info(`statting wss, port=${port}, env=${env}`);
  server.listen(port);
});

import http from 'http';
import { getEquipmentWss, getTransportWss } from 'services';
import url from 'url';
import { getEnvPort, getNodeEnv, Log } from 'utils';

const log = Log('watcher');

const port = getEnvPort();
const env = getNodeEnv();

log.info(`start, port=${port}, env=${env}`);

const server = http.createServer();
const wssTransport = getTransportWss(env);
const wssEqipment = getEquipmentWss(env);

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

server.listen(8080);

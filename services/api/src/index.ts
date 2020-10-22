import express from 'express';
import { initEquipmentApi, initTransportApi } from 'services';
import { Log } from 'utils';
import cors from 'cors';

const log = Log('api');
const port = process.env.PORT || 8080;
const env = process.env.NODE_ENV || 'dev';

log.info(`start, port=${port}, env=${env}`);

const app = express();
app.use(cors());

initTransportApi(app);
initEquipmentApi(app);

log.info(`start listening at ${port}`);
app.listen(port, () => {
  log.info(`start listening at ${port} done`);
});

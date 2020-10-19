import express from 'express';
import { initTransportApi } from 'services';
import { Log } from 'utils';
import cors from 'cors';

const log = Log('api');
const port = process.env.PORT || 8080;
const env = process.env.NODE_ENV || 'dev';

log.info(`start, port=${port}, env=${env}`);

const app = express();
app.use(cors());

initTransportApi(app);

log.info(`start listening at ${port}`);
app.listen(8080, () => {
  log.info(`start listening at ${port} done`);
});

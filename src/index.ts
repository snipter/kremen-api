import express from 'express';
import { initTransportApi } from 'services';
import { Log } from 'utils';
import cors from 'cors';

const log = Log('app');

const app = express();
app.use(cors());

initTransportApi(app);

const port = process.env.PORT || 8080;
log.info(`start listening at ${port}`);
app.listen(8080, () => {
  log.info(`start listening at ${port} done`);
});

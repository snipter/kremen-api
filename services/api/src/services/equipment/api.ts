import axios from 'axios';
import { DataSourceError, delay, HttpReqQs, Log, secMs } from 'utils';

import { EquipmentListResponse, EquipmentReqWithTimerRes, EquipmentTimer } from './types';
import { getParsedTickInfoFromStr, getSessionIdFromBody, getTimerInfoFromBody } from './utils';

const log = Log('equipment');

interface EquipmentApiOpt {
  sid?: string;
}

export const getEquipmentApi = (opt: EquipmentApiOpt = {}) => {
  let sid: string | undefined = opt.sid;

  const apiReq = async <T>({ qs }: { qs?: HttpReqQs } = {}): Promise<T> => {
    const url = 'http://admin.logistika.org.ua:1999/';
    const reqQs = qs;
    if (qs && Object.keys(qs)) {
      log.debug('api req, url=', url, ', qs=', qs);
    } else {
      log.debug('api req, url=', url);
    }
    try {
      const { data } = await axios({ url, params: reqQs, timeout: secMs * 10 });
      return data;
    } catch (err) {
      throw new DataSourceError(err.message);
    }
  };

  const list = async (initTimer?: EquipmentTimer): Promise<EquipmentListResponse> => {
    let curTimer: EquipmentTimer | undefined = initTimer;
    log.debug('starting');

    if (!sid) {
      log.info('getting session id');
      sid = await getSessionId();
      log.info(`getting session id done`, { sid });
    }

    if (!curTimer) {
      log.info(`make configure req`);
      const confBody = await makeConfigureReq();
      log.info(`make configure req done`, { body: confBody });
      log.info(`getting timer data`);
      curTimer = getTimerInfoFromBody(confBody);
      log.info(`getting timer data done`, curTimer);
      if (!curTimer) {
        throw new DataSourceError('conf add timer is empty');
      }
    }

    let attempts = 3;
    while (attempts > 0) {
      if (!curTimer) {
        throw new DataSourceError('Current timer not set');
      }
      const { timer, equipment }: EquipmentReqWithTimerRes = await reqWithTimer(curTimer);
      curTimer = timer;
      if (equipment.length !== 0) {
        log.debug('getting equipment list done');
        return { equipment, system: { sid, timer: curTimer } };
      } else {
        log.debug(`equipment list empty, attempts=`, attempts);
        attempts -= 1;
      }
    }

    throw new DataSourceError('Cannot get equipment list');
  };

  const reqWithTimer = async (timer: EquipmentTimer): Promise<EquipmentReqWithTimerRes> => {
    await delay(timer.val);
    const tickBody = await makeTickReq(timer.name);
    const newTimer = getTimerInfoFromBody(tickBody);
    const resTimer = newTimer ? newTimer : timer;
    const {
      data: { equipment },
    } = getParsedTickInfoFromStr(tickBody);
    return { timer: resTimer, equipment };
  };

  const getSessionId = async (): Promise<string | undefined> => {
    const body = await apiReq<string>();
    return getSessionIdFromBody(body);
  };

  const makeConfigureReq = async (): Promise<string> => {
    const qs = { SID: sid, Sender: 'Cundefined', Event: 'CREATE' };
    const body = await apiReq<string>({ qs });
    return body;
  };

  const makeTickReq = async (sender: string): Promise<string> => {
    log.debug(`making tick req, sender: ${sender}`);
    const qs = { SID: sid, Sender: sender, Event: 'Tici' };
    const body = await apiReq<string>({ qs });
    log.debug(`making tick req done`);
    return body;
  };

  return { list };
};

export * from './types';

import md5 from 'md5';
import request, { CookieJar } from 'request';
import { IEuipDataResp, IEquipTimer, EquipMachineType, IEquipMachine } from './types';
import { Log, anyToStr, regExecAll, delay, asyncReq, pad } from 'utils';
import { keys } from 'lodash';
const log = Log('equipment.api');

interface IEQMachneryData {
  name: string | null;
  company: string | null;
  group: string | null;
  speed: string | null;
  time: string | null;
  [key: string]: string | null;
}

interface IEQReqWithTimerRes {
  timer: IEquipTimer;
  equipment: IEquipMachine[];
}

const rootUrl = 'http://admin.logistika.org.ua:1999/';

const getSessionIdFromBody = (body: string): string | null => {
  const match = /MySID="(.+?)"/g.exec(body);
  return match ? match[1] : null;
};

const getTimerInfoFromBody = (body: string): IEquipTimer | null => {
  const match = /AddTimer\("(.+?)",(\d+)\)/g.exec(body);
  if (!match) { return null; }
  const name = match[1];
  if (!name) { throw new Error(`Wrong timer name: ${anyToStr(name)}`); }
  const val = Number.parseInt(match[2], 10);
  if (isNaN(val))  { throw new Error(`Wrong timer val: ${anyToStr(val)}`); }
  return { name, val };
};

const parseSpeed = (str: string): number => {
  const match = /\d+/.exec(str);
  return match ? parseInt(match[0], 10) : 0;
};

const contentWidnowCmdsFromBody = (body: string) => {
  const reg = /contentWindow.(.+?)\((.*?)\)/g;
  const matches = regExecAll(reg, body);
  const arr = matches.map((match) => {
    const name: string = match[1] || '';
    const rawParams: string = match[2] || '';
    const params = !rawParams ? [] : rawParams.split(',').map(
      (param) => !param ? param : param.trim(),
    );
    return { name, params };
  });
  return arr;
};

const timerStrToTs = (val: string): number => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const dateStr = `${now.getFullYear()}-${pad(`${month}`, 2)}-${now.getDate()}T${val}`;
  const date = new Date(dateStr);
  const ts = date.getTime();
  return isNaN(ts) ? 0 : ts;
}

interface ITickBodyInfoRes {
  equipment: IEquipMachine[];
}

const getInfoFromTickBody = (body: string): ITickBodyInfoRes => {
  const empty: ITickBodyInfoRes =  { equipment: [] };
  if (!body) { return empty; }
  const cmds = contentWidnowCmdsFromBody(body);
  if (!cmds.length) { return empty; }
  let equipment: IEquipMachine[] = [];
  cmds.forEach(({ name, params }) => {
    if (name === 'clear_source') {
      equipment = [];
    } else if (name === 'clear_array') {
      equipment = [];
    } else if (name === 'addDots') {
      const info = parseMachineryData(params[2]);
      if (!info) {
        log.err(`parsing machinery info error, ${name}: ${JSON.stringify(params)}`);
      } else {
        const { company, group: groupStr, name, speed: speedStr, time: timeStr } = info;
        const lat = Number.parseFloat(params[0]);
        const lng = Number.parseFloat(params[1]);
        const eid = marchineryDataToId(info);
        const group = groupStr ? strToEquipType(groupStr) : EquipMachineType.Unknow;
        const speed = speedStr ? parseSpeed(speedStr) : 0;
        const mod = timerStrToTs(timeStr);
        if (eid) {
          equipment.push({eid, company, name, group, lat, lng, mod, speed});
        } else {
          log.err(`empty eid with machinery info: ${JSON.stringify(info)}`);
        }
      }
    } else if (name === 'addLines') {
      //
    } else if (name === 'addTrackOnMap') {
      //
    } else if (name === 'addCarsOnMap') {
      //
    } else {
      log.warn(`unprocessed command, ${name}: ${JSON.stringify(params)}`);
    }
  });
  return { equipment };
};

const clearTime = (timeStr: string): string | null => {
  if (!timeStr) { return null; }
  const match = /\d+:\d+:\d+/g.exec(timeStr);
  return match ? match[0] : '';
};

const parseMachineryData = (dataStr: string): IEQMachneryData | null => {
  if (!dataStr) { return null; }
  const data: IEQMachneryData = {
    company: null,
    group: null,
    name: null,
    speed: null,
    time: null,
  };
  const rows = dataStr.split(/<br\/*>/g);
  rows.forEach((row) => {
    const rowReg = /<b\s*>(.+?)[: ]*?<\/b\s*>\s*?(.+)/g;
    const match = rowReg.exec(row);
    if (!match) { return log.err(`unnable to parse machinery row: "${row}"`); }
    if (!match[1]) { return log.err(`unnable to parse machinery param name: "${row}"`); }
    if (!match[2]) { return log.err(`unnable to parse machinery param value: "${row}"`); }
    const key = match[1].trim().toLocaleLowerCase();
    const val = match[2].trim();
    if (key === 'авто') {
      data.name = val ? val : null;
    } else if (key === 'компанія') {
      data.company = val ? val : null;
    } else if (key === 'група') {
      data.group = val ? val : null;
    } else if (key === 'швидкість') {
      data.speed = val ? val : null;
    } else if (key === 'час') {
      data.time = val ? clearTime(val) : null;
    } else {
      data[key] = val ? val : null;
    }
  });
  return data;
};

const marchineryDataToId = (data: IEQMachneryData) => {
  if (!data || !data.name) { return null; }
  return md5(data.name).substr(0, 10);
};

const strToEquipType = (rawVal: string) => {
  if (!rawVal) { return EquipMachineType.Unknow; }
  const val = rawVal.trim().toLocaleLowerCase();
  if (val === 'трактори') { return EquipMachineType.Tractor; }
  if (val === 'снігоприбиральники') { return EquipMachineType.Sweeper; }
  if (val === 'посипальники') { return  EquipMachineType.Spreader; }
  if (val === 'сміттєвози') { return EquipMachineType.GarbageTruck; }
  return EquipMachineType.Unknow;
}

export default class EquipmentParser {
  private jar: CookieJar = request.jar();
  private sid: string | null = null;

  constructor(sid: string | null = null) {
    this.sid = sid;
  }

  public async list(initTimer?: IEquipTimer | null): Promise<IEuipDataResp> {
    let curTimer: IEquipTimer | null = initTimer || null;
    log.debug('starting');
    if (!this.sid) {
      log.debug('getting session id');
      this.sid = await this.getSessionId();
      log.debug(`getting session id done`, { sid: this.sid });
    }
    if (!curTimer) {
    log.debug(`make configure req`);
    const confBody = await this.makeConfigureReq();
    log.debug(`make configure req done`, { body: confBody });
    log.debug(`getting timer data`);
    curTimer = getTimerInfoFromBody(confBody);
    log.debug(`getting timer data done`, curTimer);
    if (!curTimer) { throw new Error('conf add timer is empty'); }
   }
    let attempts = 3;
    while (attempts > 0) {
    if (curTimer) {
      const { timer, equipment }: IEQReqWithTimerRes = await this.makeReqWithTimer(curTimer);
      curTimer = timer;
      if (keys(equipment).length !== 0) {
        log.debug('getting equipment list done');
        return { equipment, system: { sid: this.sid, timer: curTimer } };
      } else {
        log.debug(`equipment list empty, attempts left: ${attempts}`);
        attempts -= 1;
      }
    } else {
      throw new Error('Current timer not set');
    }
   }
    throw new Error('Cannot get equipment list');
  }

  private async makeReqWithTimer(timer: IEquipTimer): Promise<IEQReqWithTimerRes> {
    await delay(timer.val);
    const tickBody = await this.makeTickReq(timer.name);
    const newTimer = getTimerInfoFromBody(tickBody);
    const resTimer =  newTimer ? newTimer : timer;
    const { equipment } = getInfoFromTickBody(tickBody);
    return { timer: resTimer, equipment };
  }

  private async getSessionId() {
    const { body } = await asyncReq({url: rootUrl, jar: this.jar});
    return getSessionIdFromBody(body);
  }

  private async makeConfigureReq() {
    const qs = { SID: this.sid, Sender: 'Cundefined', Event: 'CREATE' };
    const { body } = await asyncReq({url: rootUrl, qs, jar: this.jar});
    return body;
  }

  private async makeTickReq(sender: string) {
    log.debug(`making tick req, sender: ${sender}`);
    const qs = { SID: this.sid, Sender: sender, Event: 'Tici' };
    const { body } = await asyncReq({ url: rootUrl, qs, jar: this.jar });
    log.debug(`making tick req done`);
    return body;
  }
}

export * from './types';

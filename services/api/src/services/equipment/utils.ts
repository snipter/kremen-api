import {
  EquipmentTimer,
  EquipmentMachineType,
  EquipmentParseMachineRes,
  EquipmentParseMachineData,
  EquipmentParseTickRes,
  EquipmentMachine,
} from './types';
import { pad, regExecAll, LogHandler } from 'utils';
import md5 from 'md5';

// Parse

export const getSessionIdFromBody = (body: string): string | undefined => {
  const match = /MySID="(.+?)"/g.exec(body);
  return match ? match[1] : undefined;
};

export const getTimerInfoFromBody = (body: string): EquipmentTimer | undefined => {
  const match = /AddTimer\("(.+?)",(\d+)\)/g.exec(body);
  if (!match) {
    return undefined;
  }
  const name = match[1];
  if (!name) {
    throw new Error(`Wrong timer name: ${name}`);
  }
  const val = Number.parseInt(match[2], 10);
  if (isNaN(val)) {
    throw new Error(`Wrong timer val: ${val}`);
  }
  return { name, val };
};

export const getParsedTickInfoFromStr = (body: string, log?: LogHandler): EquipmentParseTickRes => {
  const empty: EquipmentParseTickRes = { data: { equipment: [] } };
  if (!body) {
    return empty;
  }
  const cmds = getContentWindowCmdsFromStr(body);
  if (!cmds.length) {
    return empty;
  }
  const errs: string[] = [];
  const warns: string[] = [];
  let equipment: EquipmentMachine[] = [];
  cmds.forEach(({ name, params }) => {
    if (name === 'clear_source') {
      equipment = [];
    } else if (name === 'clear_array') {
      equipment = [];
    } else if (name === 'addDots') {
      const { data: info, errs: infoErrs, warns: infoWarns } = getParsedMachineInfoFromStr(params[2], log);
      if (infoErrs) {
        errs.push(...infoErrs);
      }
      if (infoWarns) {
        errs.push(...infoWarns);
      }
      if (!info) {
        log?.err(`parsing machinery info error, ${name}: ${JSON.stringify(params)}`);
        errs.push(`parsing machinery info error, ${name}: ${JSON.stringify(params)}`);
      } else {
        const { company, group: groupStr, name, speed: speedStr, time: timeStr } = info;
        const lat = Number.parseFloat(params[0]);
        const lng = Number.parseFloat(params[1]);
        const eid = getMachineIdFromParsedData(info);
        const group = groupStr ? getMachineTypeFromStr(groupStr) : EquipmentMachineType.Unknow;
        const speed = speedStr ? getSpeedFromStr(speedStr) : 0;
        const modTs = timeStr ? timerStrToTs(timeStr) : 0;
        if (eid) {
          equipment.push({ eid, company, name, type: group, lat, lng, modTs, speed });
        } else {
          log?.err(`empty eid with machinery info: ${JSON.stringify(info)}`);
          errs.push(`empty eid with machinery info: ${JSON.stringify(info)}`);
        }
      }
    } else if (name === 'addLines') {
      //
    } else if (name === 'addTrackOnMap') {
      //
    } else if (name === 'addCarsOnMap') {
      //
    } else {
      log?.warn(`unprocessed command, ${name}: ${JSON.stringify(params)}`);
      warns.push(`unprocessed command, ${name}: ${JSON.stringify(params)}`);
    }
  });
  return { data: { equipment }, warns: warns.length ? warns : undefined, errs: errs.length ? errs : undefined };
};

const getContentWindowCmdsFromStr = (body: string) => {
  const reg = /contentWindow.(.+?)\((.*?)\)/g;
  const matches = regExecAll(reg, body);
  const arr = matches.map(match => {
    const name: string = match[1] || '';
    const rawParams: string = match[2] || '';
    const params = !rawParams ? [] : rawParams.split(',').map(param => (!param ? param : param.trim()));
    return { name, params };
  });
  return arr;
};

const getMachineIdFromParsedData = (data: EquipmentParseMachineData): string => {
  if (!data.name) {
    return 'empty';
  }
  return md5(data.name).substr(0, 10);
};

export const getMachineTypeFromStr = (rawVal: string): EquipmentMachineType => {
  if (!rawVal) {
    return EquipmentMachineType.Unknow;
  }
  const val = rawVal.trim().toLocaleLowerCase();
  if (val === 'трактори') {
    return EquipmentMachineType.Tractor;
  }
  if (val === 'снігоприбиральники') {
    return EquipmentMachineType.Sweeper;
  }
  if (val === 'посипальники') {
    return EquipmentMachineType.Spreader;
  }
  if (val === 'сміттєвози') {
    return EquipmentMachineType.GarbageTruck;
  }
  return EquipmentMachineType.Unknow;
};

export const getParsedMachineInfoFromStr = (dataStr: string, log?: LogHandler): EquipmentParseMachineRes => {
  if (!dataStr) {
    log?.err(`input string is empty`);
    return { errs: [`input string is empty`] };
  }

  const data: EquipmentParseMachineData = {};
  const errs: string[] = [];
  const warns: string[] = [];

  const rows = dataStr.split(/<br\/*>/g);
  rows.forEach(row => {
    const rowReg = /<b\s*>(.+?)[: ]*?<\/b\s*>\s*?(.+)/g;
    const match = rowReg.exec(row);
    if (!match) {
      log?.err(`unnable to parse machinery row="${row}"`);
      return errs.push(`unnable to parse machinery row="${row}"`);
    }
    if (!match[1]) {
      log?.err(`unnable to parse machinery param name="${row}"`);
      return errs.push(`unnable to parse machinery param name="${row}"`);
    }
    if (!match[2]) {
      log?.err(`unnable to parse machinery param value="${row}"`);
      return errs.push(`unnable to parse machinery param value="${row}"`);
    }
    const key = match[1].trim().toLocaleLowerCase();
    const val = match[2].trim();
    if (key === 'авто' && val) {
      data.name = val;
    } else if (key === 'компанія' && val) {
      data.company = val;
    } else if (key === 'група' && val) {
      data.group = val;
    } else if (key === 'швидкість' && val) {
      data.speed = val;
    } else if (key === 'час' && val) {
      data.time = getTimeFromStr(val);
    } else {
      log?.warn(`unused machinery parameter, key=`, key, `, val=`, val);
      warns.push(`unused machinery parameter, key=${key}, val=${val}`);
    }
  });
  return { data, errs: errs.length ? errs : undefined, warns: warns.length ? warns : undefined };
};

export const getSpeedFromStr = (str: string): number => {
  const match = /\d+/.exec(str);
  return match ? parseInt(match[0], 10) : 0;
};

const getTimeFromStr = (timeStr: string): string | undefined => {
  if (!timeStr) {
    return undefined;
  }
  const match = /\d+:\d+:\d+/g.exec(timeStr);
  return match ? match[0] : undefined;
};

// Convertors

export const timerStrToTs = (val: string): number => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const dateStr = `${now.getFullYear()}-${pad(`${month}`, 2)}-${now.getDate()}T${val}`;
  const date = new Date(dateStr);
  const ts = date.getTime();
  return isNaN(ts) ? 0 : ts;
};

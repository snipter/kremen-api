import { asyncReq, Log } from 'utils';
import iconv from 'iconv-lite';
import { isBuffer } from 'lodash';
const log = Log('cinemas.adapters.utils');

export const  getHtml = async (url: string): Promise<string> => {
  const reqOpt = { url, encoding: null };
  let { body } = await asyncReq(reqOpt);
  // Converting
  const encodingFromBody = getEncodingFromHtml(body.toString());
  if (encodingFromBody) {
    try {
      body = iconv.decode(body, encodingFromBody);
    } catch (e) {
      throw { name: 'ENCODING_CONVERSION_ERR', descr: url };
    }
  }
  // Return body
  return isBuffer(body) ? body.toString() : body;
};

const getEncodingFromHtml = (body: string): string | null => {
  const encodingReg = /<meta charset="([\w-]+)"[\/\s]+?>/g;
  const match = encodingReg.exec(body);
  if (!match) {
    return null;
  }
  const encodingStr = match[1].toLowerCase().trim();
  if (encodingStr === 'windows-1251') { return 'cp1251'; }
  return encodingStr;
};

export const urkStrToMonth = (rawVal: string) => {
  const val = rawVal.toLocaleLowerCase();
  if (val.indexOf('січ') !== -1) { return 1; }
  if (val.indexOf('лют') !== -1) { return 2; }
  if (val.indexOf('берез') !== -1) { return 3; }
  if (val.indexOf('квіт') !== -1) { return 4; }
  if (val.indexOf('трав') !== -1) { return 5; }
  if (val.indexOf('черв') !== -1) { return 6; }
  if (val.indexOf('лип') !== -1) { return 7; }
  if (val.indexOf('серп') !== -1) { return 9; }
  if (val.indexOf('верес') !== -1) { return 9; }
  if (val.indexOf('жовт') !== -1) { return 10; }
  if (val.indexOf('лист') !== -1) { return 11; }
  if (val.indexOf('груд') !== -1) { return 12; }
  log.err('could not parse urk month from str: ', rawVal);
  return NaN;
}

export const dateToStr = (val: Date) => (
  val.toISOString().slice(0, 19).replace('T', ' ')
);
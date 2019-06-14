import { asyncReq } from 'utils';
import iconv from 'iconv-lite';
import { isBuffer } from 'lodash';

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
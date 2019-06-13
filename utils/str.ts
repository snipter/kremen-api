import { isString, isNumber, isDate, isError, isFunction } from 'lodash';

export const anyToStr = (val: any): string => {
  if (val === undefined) { return 'undefined'; }
  if (val === null) { return 'null'; }
  if (isString(val)) { return val; }
  if (isNumber(val)) { return `${val}`; }
  if (isDate(val) || isError(val) || isFunction(val.toString)) { return val.toString(); }
  if (!val) { return ''; }
  return '';
};

export const regExecAll = (expr: RegExp, str: string) => {
  let match: null | RegExpExecArray = null;
  const matches = new Array();
  // tslint:disable-next-line
  while (match = expr.exec(str)) {
    const matchArray: string[] = [];
    for (const i in match) {
      if (!isNaN(parseInt(i, 10))) {
        matchArray.push(match[i]);
      }
    }
    matches.push(matchArray);
  }
  return matches;
};

export const pad = (val: string, length: number) => {
  let newVal = val;
  while (newVal.length < length) {
    newVal = `0${newVal}`;
  }
  return newVal;
}

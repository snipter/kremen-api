export const regExecAll = (expr: RegExp, str: string) => {
  let match: null | RegExpExecArray = null;
  // eslint-disable-next-line @typescript-eslint/no-array-constructor
  const matches = new Array();
  // tslint:disable-next-line
  // eslint-disable-next-line no-cond-assign
  while ((match = expr.exec(str))) {
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
};

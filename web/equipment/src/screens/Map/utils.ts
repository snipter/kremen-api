import { getConf, setConf } from 'core';

export const getMapZoomConf = (defVal: number): number => {
  const rawVal = getConf<number>('zoom');
  return rawVal || defVal;
};

export const setMapZoomConf = (val: number) => {
  setConf('zoom', val);
};

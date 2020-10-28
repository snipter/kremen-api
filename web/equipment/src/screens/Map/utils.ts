import { getConf, LatLng, setConf } from 'core';

export const getMapCenterConf = (defVal: LatLng): LatLng => {
  const rawVal = getConf('center');
  return rawVal || defVal;
};

export const setMapCenterConf = (val: LatLng) => {
  setConf('center', val);
};

export const getMapZoomConf = (defVal: number): number => {
  const rawVal = getConf('zoom');
  return rawVal || defVal;
};

export const setMapZoomConf = (val: number) => {
  setConf('zoom', val);
};

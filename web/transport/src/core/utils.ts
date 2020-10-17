import color from 'color';
import { sortBy } from 'lodash';
import { ColorsSet } from 'styles';
import { TransportRoute } from '@kremen/core';

interface RoutesColorsMap {
  [key: string]: ColorsSet;
}

const colorSetFromColor = (val: string): ColorsSet => ({
  light: val,
  dark: color(val)
    .darken(0.5)
    .toString(),
});

const routeColors: RoutesColorsMap = {
  '1': colorSetFromColor('#6B7A89'),
  '2': colorSetFromColor('#2ABC9B'),
  '2-в': colorSetFromColor('#765D69'),
  '3-а': colorSetFromColor('#8FB9A8'),
  '3-б': colorSetFromColor('#D8434E'),
  '4': colorSetFromColor('#F7BB43'),
  '9': colorSetFromColor('#F2CC8C'),
  '10': colorSetFromColor('#4AB19D'),
  '11': colorSetFromColor('#475C7A'),
  '12': colorSetFromColor('#B2C253'),
  '13': colorSetFromColor('#C72C41'),
  '15': colorSetFromColor('#3BB0D9'),
  '15-б': colorSetFromColor('#E0535D'),
  '16': colorSetFromColor('#449BB8'),
  '17': colorSetFromColor('#DBBD49'),
  '18': colorSetFromColor('#39B65C'),
  '25': colorSetFromColor('#6B7A89'),
  '28': colorSetFromColor('#7E8C8D'),
  '30': colorSetFromColor('#D970AD'),
  '216': colorSetFromColor('#7277D5'),
  'Т 01': colorSetFromColor('#E0535D'),
  'Т 02': colorSetFromColor('#449BB8'),
  'Т 3-Б': colorSetFromColor('#8E44AD'),
  'Т 3-Д': colorSetFromColor('#F0C40B'),
  'Т 05': colorSetFromColor('#E67E23'),
  'Т 06': colorSetFromColor('#A7B23C'),
  default: colorSetFromColor('#000000'),
};

export const defaultRouteColors = colorSetFromColor('#000000');

export const offlineColors = colorSetFromColor('#BDC3C7');

export const routeNumberToColor = (val: string) => routeColors[val] || defaultRouteColors;

export const clearRouteNumber = (val: string): string => {
  let mod: string = val.replace(/Т\s+0*/g, '');
  mod = mod.toUpperCase();
  return mod;
};

export const sortRoutes = (arr: TransportRoute[]): TransportRoute[] =>
  sortBy(arr, route => {
    const match = /(\d+)(-([\w\W]+))*/g.exec(route.number);
    const base = 1000;
    if (!match) {
      return base * 100;
    }
    if (!match[3]) {
      return parseInt(match[0], 10) * base;
    }
    return parseInt(match[0], 10) * base + match[3].charCodeAt(0);
  });

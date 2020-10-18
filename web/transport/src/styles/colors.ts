import color from 'color';

export interface ColorsSet {
  light: string;
  dark: string;
}

const base = {
  orange: '#ff9800',
  red: '#D8434E',
  green: '#4CAF50',
  blue: '#3273dc',
  violet: '#c018c0',
  pink: '#E91E63',
  purple: '#9C27B0',
  deepPurple: '#673AB7',
  indigo: '#3F51B5',
  cyan: '#00BCD4',
  lime: '#CDDC39',
  yellow: '#F5D456',
  white: '#fff',
};

const named = {
  mainColor: base.red,
};

export const withAlpha = (val: string, alpha: number) => color(val).alpha(alpha).toString();

export const colors = {
  ...base,
  ...named,
  withAlpha,
};

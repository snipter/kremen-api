import color from 'color';

export interface ColorsSet {
  light: string;
  dark: string;
}

const base = {
  red: '#E0535D',
  orange: '#E97B18',
  blue: '#5097D5',
  white: '#fff',
  back: '#000',
  lightGrey: '#BDC3C7',
};

const named = {
  primary: base.red,
};

export const withAlpha = (val: string, alpha: number) => color(val).alpha(alpha).toString();

export const colors = {
  ...base,
  ...named,
  withAlpha,
};

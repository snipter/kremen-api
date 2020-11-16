import color from 'color';

export const withAlpha = (val: string, alpha: number) => color(val).alpha(alpha).toString();

export const colors = {
  white: '#fff',
  primary: '#ECB400',
  withAlpha,
};

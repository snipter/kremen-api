import { IStyle } from './types';

export const fullScreen: IStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

export const screenCenter: IStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translateX(-50%) translateY(-50%)',
};

export const horizontalCenter: IStyle = {
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
};

export const threeDots: IStyle = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

export const fullFixedScreen: IStyle = {
  position: 'fixed',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

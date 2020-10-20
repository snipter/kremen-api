import { Style } from './types';

export const fullScreen: Style = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

export const screenCenter: Style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translateX(-50%) translateY(-50%)',
};

export const horizontalCenter: Style = {
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
};

export const threeDots: Style = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

export const fullFixedScreen: Style = {
  position: 'fixed',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

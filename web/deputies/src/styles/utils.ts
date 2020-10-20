import { compact, each, isArray, isBoolean } from 'lodash';
import { Style, MergeStyleVals } from './types';

/**
 * Merge styles
 * @param {MergeStyleVals} arr - styles
 */
export const m = (...arr: MergeStyleVals[]): Style => {
  if (!arr) {
    return {};
  }
  let style: Style = {};
  each(arr, (rawItem: MergeStyleVals) => {
    const item = isArray(rawItem) ? m(...rawItem) : rawItem;
    if (isBoolean(item)) {
      return;
    }
    if (!item) {
      return;
    }
    style = { ...style, ...item };
  });
  return style;
};

/**
 * Converts number to string with px
 * @param {number} val - pixels
 */
export const px = (val: number): string => `${val}px`;

/**
 * Padding
 * @param {number} top - top val
 * @param {number} right - right val
 * @param {number} bottom - bottom val
 * @param {number} left  - left val
 */
export const pdd = (top: number, right: number, bottom: number, left: number): string =>
  `${top}px ${right}px ${bottom}px ${left}px`;

export type McnItem = string | boolean;

/**
 * Merge class names
 * @param {string[]} items - class names
 */
export const mcn = (...items: McnItem[]): string => compact(items).join(' ');

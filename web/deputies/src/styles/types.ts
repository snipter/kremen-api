import { CSSProperties } from 'react';

export type IStyle = CSSProperties;
export type ITextStyle = CSSProperties;

export interface IStyles {
  [key: string]: IStyle;
}

export type MergeStyleVal = IStyle | null | undefined | boolean;
export type MergeStyleVals = MergeStyleVal | MergeStyleVal[];

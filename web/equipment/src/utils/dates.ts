import moment from 'moment';

export const secMs = 1000;
export const minMs = secMs * 60;
export const hourMs = minMs * 60;
export const dayMs = hourMs * 24;
export const weekMs = dayMs * 24;
export const monthMs = weekMs * 4;

export const fullMonthsList: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export const tsToDateStr = (ts: number, format?: string) => moment(ts).format(format ? format : 'DD.MM.YYYY HH:mm:ss');

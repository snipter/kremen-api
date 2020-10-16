export const sec = 1;
export const minSec = 60;
export const hourSec = 3600;
export const daySec = 86400;

export const delay = (val: number) => new Promise(resolve => setTimeout(() => resolve(), val));

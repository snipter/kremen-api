export const sec = 1;
export const secMs = 1000;
export const minSec = 60;
export const hourMs = secMs * 60;
export const hourSec = minSec * 60;
export const dayMs = hourMs * 24;
export const daySec = hourSec * 24;

export const delay = (val: number) => new Promise(resolve => setTimeout(() => resolve(), val));

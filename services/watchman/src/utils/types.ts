export const getObjectsDiff = <T extends Object>(prev: T, next: T): Partial<T> => {
  const res: Partial<T> = {};
  type K = keyof T;
  const keys: K[] = (Object.keys(next) as unknown) as K[];
  for (const key of keys) {
    if (next[key] !== prev[key]) {
      res[key] = next[key] as any;
    }
  }
  return res;
};

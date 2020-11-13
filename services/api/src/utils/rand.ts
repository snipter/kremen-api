export const genRandId = (size = 19) =>
  (Math.random().toString(36).substring(2) + new Date().getTime().toString(36)).substring(0, size);

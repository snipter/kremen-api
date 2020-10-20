export const  capitalizeFirstLetter = (val: string) => {
  return val.charAt(0).toUpperCase() + val.slice(1);
};

export const pad = (val: string, max: number): string => {
  return val.length < max ? pad(`0${val}`, max) : val;
};

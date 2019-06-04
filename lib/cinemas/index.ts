import { getCinema as getGalaxyCinema } from './adapterGalaxy';

export const getCinemas = async () => {
  return Promise.all([
    getGalaxyCinema()
  ]);
}

export * from './types';

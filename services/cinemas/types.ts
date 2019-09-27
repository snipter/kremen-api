import { ILatLng } from 'core';

export interface ICinema {
  cid: string;
  title: string;
  website?: string;
  source: string;
  contacts: ICinemaContact[];
  location?: ICinemaLocation;
  movies: ICinemaMovie[];
}

export interface ICinemaContact {
  mobile?: string;
  email?: string;
}

export interface ICinemaLocation {
  address?: string;
  coordinates: ILatLng;
}

export interface ICinemaMovie {
  title: ICinemaMovieTitle;
  poster?: string;
  descr?: string;
  sessions: ICinemaSession[];
}

export interface ICinemaMovieTitle {
  original?: string;
  local: string;
}

export interface ICinemaSession {
  date: string;
  price: number;
  format: CinemaMovieFormat;
}

export type CinemaMovieFormat = '2D' | '3D';

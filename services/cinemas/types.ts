export type CinemaMovieFormat = '2D' | '3D';

export interface ICinemaSession {
  date: string;
  price: number;
  format: CinemaMovieFormat;
}

export interface ICinemaMovieTitle {
  original?: string;
  local: string;
}

export interface ICinemaMovie {
  title: ICinemaMovieTitle;
  poster?: string;
  descr?: string;
  sessions: ICinemaSession[];
}

export interface ICinemaContact {
  mobile?: string;
}

export interface ICinema {
  cid: string;
  title: string;
  website?: string;
  contacts: ICinemaContact[];
  movies: ICinemaMovie[];
}

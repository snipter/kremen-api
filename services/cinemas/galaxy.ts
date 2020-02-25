import {
  Cinema,
  CinemaContact,
  CinemaLocation,
  CinemaMovie,
  CinemaMovieFormat,
  CinemaMovieTitle,
  CinemaSession,
  pad,
} from '@kremen/core';
import cheerio from 'cheerio';
import { Log } from 'utils';

import { dateToStr, getHtml, urkStrToMonth } from './utils';

const log = Log('cinemas.adapters.galaxy');

const scheduleUrl = 'https://bilet.vkino.com.ua/afisha/galaktika/';

// Cinema

export const getCinema = async (): Promise<Cinema> => {
  const cid = 'galaxy';
  const title = 'Галактика';
  const website = 'http://galaktika-kino.com.ua/';
  const source = 'https://bilet.vkino.com.ua/afisha/galaktika/';
  const contacts: CinemaContact[] = [{ mobile: '0-800-211-504' }];
  const location: CinemaLocation = {
    address: 'м. Кременчук, вул.  Леніна 21 ТРК «Галактика» 4-й поверх',
    coordinates: { lat: 49.06950786993555, lng: 33.41672313624573 },
  };
  const movies = await getMovies();
  return { cid, title, location, website, source, contacts, movies };
};

// Schedule

const getMovies = async (): Promise<CinemaMovie[]> => {
  const html = await getHtml(scheduleUrl);
  const $ = cheerio.load(html, { decodeEntities: false });
  const movies: CinemaMovie[] = [];
  $('.showtimes').each((_index, el) => {
    const title = strToMovieTitle($('h2', el).text());
    const poster = $('.poster', el).attr()['data-poster-url'];
    const sessions = getSessions($('.showstimes', el), $);
    const movie: CinemaMovie = { title, poster, sessions };
    movies.push(movie);
  });
  return movies;
};

const getSessions = (el: Cheerio, $: CheerioStatic): CinemaSession[] => {
  const sessions: CinemaSession[] = [];
  let lastDate: Date | undefined = new Date();
  el.children().each((_index, child) => {
    if (child.name === 'div') {
      lastDate = strToSessionDate($(child).text());
    }
    if (child.name === 'span' && lastDate) {
      if (lastDate) {
        const session = parseSession(child, $, lastDate);
        if (session) {
          sessions.push(session);
        }
      } else {
        log.err('unable to parse session cos lastDate is undefined');
      }
    }
  });
  return sessions;
};

const parseSession = (el: CheerioElement, $: CheerioStatic, date: Date): CinemaSession | undefined => {
  const timeStr = $('a', el).text();
  const time = strToSessionTime(timeStr, date);
  if (!isNaN(time.getTime())) {
    const formatStr = $(el).attr()['class'];
    const format = strToMovieFormat(formatStr);
    const priceStr = $('.price-list', el).text();
    const price = strToPrice(priceStr);
    return { date: dateToStr(time), format, price };
  } else {
    log.err(`parsing time error: "${timeStr}"`);
    return undefined;
  }
};

const strToSessionDate = (val: string): Date | undefined => {
  const month = urkStrToMonth(val);
  if (isNaN(month)) {
    return undefined;
  }
  const dateMatch = /\d+/.exec(val);
  if (!dateMatch) {
    log.err('unable to get date from str: ', val);
    return undefined;
  }
  const date = parseInt(dateMatch[0]);
  const dateStr = `${new Date().getFullYear()}-${pad(`${month}`, 2)}-${date}`;
  const res = new Date(dateStr);
  if (isNaN(res.getTime())) {
    log.err('date str parsing error', dateStr);
    return undefined;
  }
  return res;
};

const strToMovieFormat = (rawVal: string): CinemaMovieFormat => {
  const val = rawVal.trim().toLocaleLowerCase();
  if (val.indexOf('3d') !== -1) {
    return '3D';
  }
  if (val.indexOf('2d') !== -1) {
    return '2D';
  }
  log.err(`unknow movie format: ${rawVal}`);
  return '2D';
};

const strToPrice = (val: string): number => {
  const match = /\d+/g.exec(val);
  return match ? parseInt(match[0], 10) : 0;
};

const strToSessionTime = (rawVal: string, dayDate: Date): Date => {
  const val = rawVal.trim();
  const month = dayDate.getMonth() + 1;
  const dateStr = `${dayDate.getFullYear()}-${pad(`${month}`, 2)}-${dayDate.getDate()}T${val}`;
  return new Date(dateStr);
};

const strToMovieTitle = (val: string): CinemaMovieTitle => {
  const match = /(.+?)[\s\t]+\/[\s\t]+(.+)/g.exec(val);
  if (!match) {
    return { local: val };
  }
  const local = match[1].trim();
  const original = match[2].trim();
  return { local, original };
};

// import { Log } from 'utils';
import { ICinema, ICinemaContact, ICinemaLocation } from './types';

// http://filmax.net.ua/kremenchuk/

// const log = Log('cinemas.adapters.filmax');
// const scheduleUrl = 'https://bilet.vkino.com.ua/afisha/galaktika/';

// Cinema

export const getCinema = async (): Promise<ICinema> => {
  const cid = 'filmax';
  const title = 'Filmax';
  const website = 'http://filmax.net.ua/';
  const source = 'http://filmax.net.ua/kremenchuk/фильмы/';
  const contacts: ICinemaContact[] = [
    { mobile: '+380997362975' },
    { mobile: '+380981099973' },
    { email: 'filmaxcinema@gmail.com' },
  ];
  const location: ICinemaLocation = {
    address: 'пр. Лесі Українки, 96, Кременчук, Полтавська область, 39600',
    coordinates: { lat: 49.133310, lng: 33.442220 },
  };
  const movies = [];
  return { cid, title, website, source, location, contacts, movies };
};
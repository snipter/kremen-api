import { Cinema, CinemaContact, CinemaLocation } from '@kremen/core';

// http://filmax.net.ua/kremenchuk/

// const log = Log('cinemas.adapters.filmax');
// const scheduleUrl = 'https://bilet.vkino.com.ua/afisha/galaktika/';

// Cinema

export const getCinema = async (): Promise<Cinema> => {
  const cid = 'filmax';
  const title = 'Filmax';
  const website = 'http://filmax.net.ua/';
  const source = 'http://filmax.net.ua/kremenchuk/фильмы/';
  const contacts: CinemaContact[] = [
    { mobile: '+380997362975' },
    { mobile: '+380981099973' },
    { email: 'filmaxcinema@gmail.com' },
  ];
  const location: CinemaLocation = {
    address: 'пр. Лесі Українки, 96, Кременчук, Полтавська область, 39600',
    coordinates: { lat: 49.13331, lng: 33.44222 },
  };
  const movies = [];
  return { cid, title, website, source, location, contacts, movies };
};

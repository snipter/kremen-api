import { asyncReq, Log } from 'utils';
import { ITransportRoute, ITransportBusInfo } from 'core';
const log = Log('TransportApi');

const apiRoot = 'http://infobus.kz';
// Data
// Ukraine country id = 3
// Kremenchuk city id = 10

/*
http://infobus.kz/countries
http://infobus.kz/countries/3/cities
http://infobus.kz/cities
http://infobus.kz/cities/10/routes
http://infobus.kz/cities/10/routeamount
http://infobus.kz/cities/10/busamount
http://infobus.kz/cities/10/routes/188/stations
http://infobus.kz/cities/10/routes/188/busses

*/

interface IAPIQueryParams {
  [key: string]: string;
}

interface IAPIReqParams {
  path: string;
  qs?: IAPIQueryParams;
}

const apiReq = async <T=any>({ path, qs }: IAPIReqParams): Promise<T> => {
  const defQs = { lang: 'ru' };
  const reqQs = qs ? {...defQs, ...qs} : defQs;
  const url = `${apiRoot}${path}`;
  log.debug('api req, url=', url, ', qs=', qs);
  const { body } = await asyncReq({url, json: true, qs: reqQs });
  return body;
}

// Country

export const getCountries = async () => (
  apiReq({path: '/countries'})
);

// City

export const getCitites = async (countryId: number) => (
  apiReq({path: `/countries/${countryId}/cities`})
);

export const withCity = (cityId: number) => {
  const getCity = async () => (
    apiReq({path: `/cities/${cityId}`})
  );
  
  // Routes
  
  const getRoutes = async () => (
    apiReq<ITransportRoute[]>({path: `/cities/${cityId}/routes`})
  );
  
  const getRoutesCount = async () => (
    apiReq({path: `/cities/${cityId}/routeamount`})
  );
  
  const getRouteStations = async (routeId: number) => (
    apiReq({path: `/cities/${cityId}/routes/${routeId}/stations`})
  );
  
  const findRoute = async (source, target) => {
    const qs = {
      sourceLat: source.lat,
      sourceLng: source.lng,
      targetLat: target.lat,
      targetLng: target.lng,
    }
    return apiReq({path: `/cities/${cityId}/pathsbwpoints`, qs})
  }
  
  // Busses
  
  const getBusesCount = async () => (
    apiReq({path: `/cities/${cityId}/busamount`})
  );
  
  const getBusesAtRoute = async (routeId: number) => (
    apiReq<ITransportBusInfo[]>({path: `/cities/${cityId}/routes/${routeId}/busses`})
  );

  const getBusesAtRoutes = async (routeIds: number[]) => {
    const arr = await Promise.all(routeIds.map((id) => getBusesAtRoute(id)));
    return arr.map((data, index) => ({ routeId: routeIds[index], data}));
  }

  return {
    getCity, getRoutes, getRoutesCount, getRouteStations, findRoute, getBusesCount, getBusesAtRoute, getBusesAtRoutes,
  };
}

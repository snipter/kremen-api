import { asyncReq, Log } from 'utils';
import { ITransportBusRaw, ITransportBus, ITransportRouteRaw, ITransportBusShort, ITransportRoute, ITransportStationRaw, ITransportStation } from './types';
import { ILatLng } from 'core';
const log = Log('TransportApi');

const apiRoot = 'http://infobus.kz';
/*
Ukraine country id = 3
Kremenchuk city id = 10
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
  [key: string]: string | number;
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

const modRawRoute = (input: ITransportRouteRaw): ITransportRoute => {
  const { busreportRouteId, location, bussesOnRoute, routeName, routeNumber } = input;
  return { rid: busreportRouteId, location, active: bussesOnRoute, name: routeName, number: routeNumber };
}

const modRawBusInfo = (input: ITransportBusRaw): ITransportBus => {
  const { busreportRouteId, cityId, imei, lon, lat, ...data } = input;
  return { tid: imei, rid: busreportRouteId, lat, lng: lon, ...data };
}

const modRawStationInfo = (input: ITransportStationRaw): ITransportStation => {
  const { id, routeId, lat, lon, ...data } = input;
  return { sid: id, rid: routeId, lat, lng: lon, ...data };
}

const busToShortInfo = (input: ITransportBus): ITransportBusShort => {
  const { tid, lat, lng, direction, speed } = input;
  return { [tid]: [lat, lng, direction, speed] };
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
  
  const getRoutes = async (): Promise<ITransportRoute[]> => (
    (await apiReq<ITransportRouteRaw[]>({path: `/cities/${cityId}/routes`})).map(modRawRoute)
  );
  
  const getRoutesCount = async () => (
    apiReq({path: `/cities/${cityId}/routeamount`})
  );
  
  const getRouteStations = async (routeId: number): Promise<ITransportStation[]> => (
    (await apiReq<ITransportStationRaw[]>({path: `/cities/${cityId}/routes/${routeId}/stations`})).map(modRawStationInfo)
  );

  const getRoutesStations = async (routeIds: number[]) => {
    const arr = await Promise.all(routeIds.map(getRouteStations));
    return arr.map((stations, index) => ({ rid: routeIds[index], stations}));
  };
  
  const findRoute = async (source: ILatLng, target: ILatLng) => {
    const qs = {
      sourceLat: source.lat, sourceLng: source.lng, targetLat: target.lat, targetLng: target.lng,
    }
    return apiReq({path: `/cities/${cityId}/pathsbwpoints`, qs})
  }
  
  // Busses
  
  const getBusesCount = async () => (
    apiReq({path: `/cities/${cityId}/busamount`})
  );
  
  const getBusesAtRoute = async (routeId: number) => (
    (await apiReq<ITransportBusRaw[]>({path: `/cities/${cityId}/routes/${routeId}/busses`})).map(modRawBusInfo)
  );

  const getBusesAtRoutes = async (routeIds: number[]) => {
    const arr = await Promise.all(routeIds.map((id) => getBusesAtRoute(id)));
    return arr.map((buses, index) => ({ rid: routeIds[index], buses}));
  }

  const getBusesShortInfo = async (routeIds: number[]): Promise<ITransportBusShort> => {
    const arr = await getBusesAtRoutes(routeIds);
    let res: ITransportBusShort = {};
    arr.forEach(({ buses }) => {
      buses.forEach((item) => {
        res = {...res, ...busToShortInfo(item)}
      })
    });
    return res;
  }

  return {
    getCity, getRoutes, getRoutesCount, getRouteStations, findRoute, getBusesCount, getBusesAtRoute, getBusesAtRoutes,
    getBusesShortInfo, getRoutesStations,
  };
}

export * from './types';

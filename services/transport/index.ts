import { asyncReq, Log } from 'utils';
import { flatten } from 'lodash';
import { ITransportBusRaw, ITransportBus, ITransportRouteRaw, ITransportBusesUpdate, ITransportRoute, ITransportStationRaw, ITransportStation, ITransportPredictionRaw, ITransportPrediction } from './types';
import { ILatLng } from 'core';
const log = Log('transport.api');

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
  return {
    rid: busreportRouteId, location, active: bussesOnRoute, name: routeName, number: routeNumber, stations: [],
  };
}

const modRawBusInfo = (input: ITransportBusRaw): ITransportBus => {
  const { busreportRouteId, cityId, imei, lon, lat, ...data } = input;
  return { tid: imei, rid: busreportRouteId, lat, lng: lon, ...data };
}

const modRawStationInfo = (input: ITransportStationRaw): ITransportStation => {
  const { id, routeId, lat, lon, ...data } = input;
  return { sid: id, rid: routeId, lat, lng: lon, ...data };
}

const modRawStationPrediction = (input: ITransportPredictionRaw): ITransportPrediction => {
  const { routeId: rid, stationId: sid, busIMEI: tid, ...data} = input;
  return {rid, sid, tid, ...data };
}

const busToShortInfo = (input: ITransportBus): ITransportBusesUpdate => {
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
  
  const findRoute = async (from: ILatLng, to: ILatLng) => {
    const qs = {
      sourceLat: from.lat, sourceLng: from.lng, targetLat: to.lat, targetLng: to.lng,
    }
    return apiReq({path: `/cities/${cityId}/pathsbwpoints`, qs})
  }

  // Stations

  const getRouteStations = async (rid: number): Promise<ITransportStation[]> => (
    (await apiReq<ITransportStationRaw[]>({path: `/cities/${cityId}/routes/${rid}/stations`})).map(modRawStationInfo)
  );

  const getRoutesStations = async (rids: number[]): Promise<ITransportStation[]> => (
    flatten(await Promise.all(rids.map(getRouteStations)))
  );

  const getStationPrediction = async (sid: number) => (
    (await apiReq<ITransportPredictionRaw[]>({path: `/cities/${cityId}/stations/${sid}/prediction`})).map(modRawStationPrediction)
  );
  
  // Busses
  
  const getBusesCount = async () => (
    apiReq({path: `/cities/${cityId}/busamount`})
  );
  
  const getRouteBuses = async (rid: number) => (
    (await apiReq<ITransportBusRaw[]>({path: `/cities/${cityId}/routes/${rid}/busses`})).map(modRawBusInfo)
  );

  const getRoutesBuses = async (rids: number[]) => {
    const arr = await Promise.all(rids.map((rid) => getRouteBuses(rid)));
    const buses: ITransportBus[] = [];
    arr.forEach((routeBuses) => buses.push(...routeBuses));
    return buses;
  }

  const getRoutesBusesUpdate = async (rids: number[]): Promise<ITransportBusesUpdate> => {
    const buses = await getRoutesBuses(rids);
    let res: ITransportBusesUpdate = {};
    buses.forEach((bus) => {
      res = {...res, ...busToShortInfo(bus)}
    });
    return res;
  }

  return {
    getCity, getRoutes, getRoutesCount, getRouteStations, findRoute, getBusesCount, getRouteBuses, getRoutesBuses,
    getRoutesBusesUpdate, getRoutesStations, getStationPrediction,
  };
}

export * from './types';
export * from './utils';

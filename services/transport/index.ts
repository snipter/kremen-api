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

Routes:

166 - 2
167 - 17
168 - 13
169 - 28
170 - 2-в
171 - 3-а
172 - 15
173 - 9
174 - 30
175 - 15-б
178 - 18
179 - 1
180 - 25
181 - 11
182 - 16
183 - 12
184 - 3-б
185 - 10
186 - 4
187 - Т 01
188 - Т 02
189 - Т 3-Б
190 - Т 3-Д
191 - Т 05
192 - Т 06
193 - 216

*/
import { asyncReq, Log } from 'utils';
import { flatten, compact } from 'lodash';
import {
  ITransportBusRaw, ITransportBus, ITransportRouteRaw, ITransportBusesUpdate, ITransportRoute, ITransportStationRaw, ITransportStation, ITransportPredictionRaw, ITransportPrediction, TransportType,
} from './types';
import { ILatLng } from 'core';
const log = Log('transport.api');

const apiRoot = 'http://infobus.kz';

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

const routeNumberToTransportType = (val: string): TransportType => {
  return val.indexOf('Т') !== -1 ? TransportType.Trolleybus : TransportType.Bus;
}

const busNameToType = (val: string): TransportType => {
  return val.indexOf('Т') === 0 ? TransportType.Trolleybus : TransportType.Bus;
}

const modRawRoute = (input: ITransportRouteRaw): ITransportRoute => {
  const { busreportRouteId, location, bussesOnRoute, routeName, routeNumber } = input;
  const path = parsePathLatLng(location);
  const type = routeNumberToTransportType(routeNumber);
  return {
    rid: busreportRouteId, type, path, active: bussesOnRoute, name: routeName, number: routeNumber, stations: [],
  };
}

const parsePathLatLng = (val: string): number[][] => {
  if (!val) { return []; }
  const pairs = val.split(', ');
  if (!pairs.length) { return []; }
  return compact(pairs.map((pairStr) => {
    const locParts = pairStr.split(' ');
    if (locParts.length !== 2) { return undefined; }
    const [lngStr, latStr] = locParts;
    return [parseFloat(latStr), parseFloat(lngStr)];
  }));
};

const modRawBusInfo = (input: ITransportBusRaw): ITransportBus => {
  const { busreportRouteId, cityId, imei, lon, lat, ...data } = input;
  const type = busNameToType(input.name.trim());
  return { tid: imei, rid: busreportRouteId, type, lat, lng: lon, ...data };
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
  const { tid, lat, lng, direction, speed, offline } = input;
  return { [tid]: [lat, lng, direction, speed, offline ? 1 : 0 ] };
}

// Country

export const getCountries = async () => (
  apiReq({path: '/countries'})
);

// City

export const getCitites = async (countryId: number) => (
  apiReq({path: `/countries/${countryId}/cities`})
);

export const apiWithCity = (cityId: number) => {
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

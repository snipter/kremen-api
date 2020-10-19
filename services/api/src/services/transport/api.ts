import { flatten } from 'lodash';

import { HttpReqQs, LatLng, Log } from 'utils';
import { defTransportRoutesIds } from './consts';
import {
  TransportBus,
  TransportBusesCompactUpdate,
  TransportCity,
  TransportCountry,
  TransportDataSourceBus,
  TransportDataSourcePrediction,
  TransportDataSourceRoute,
  TransportDataSourceStation,
  TransportRoute,
  TransportStation,
} from './types';
import {
  busToCompactUpdate,
  parseDataSourceBus,
  parseDataSourcePrediction,
  parseDataSourceRoute,
  parseDataSourceStation,
} from './utils';
import axios from 'axios';

const log = Log('api.transport');

interface TranportApiReqOpt {
  path: string;
  qs?: HttpReqQs;
}

export const getTransportApi = () => {
  const dataSourceUrl = 'http://infobus.kz';

  const apiReq = async <T>({ path, qs }: TranportApiReqOpt): Promise<T> => {
    const defQs = { lang: 'ru' };
    const reqQs = qs ? { ...defQs, ...qs } : defQs;
    const url = `${dataSourceUrl}${path}`;
    if (qs && Object.keys(qs)) {
      log.debug('api req, url=', url, ', qs=', qs);
    } else {
      log.debug('api req, url=', url);
    }
    const { data } = await axios({ url, params: reqQs });
    return data;
  };

  // Country

  const getCountries = async () => apiReq({ path: '/countries' });

  // City

  const getCitites = async (countryId: TransportCountry) => apiReq({ path: `/countries/${countryId}/cities` });

  const withCity = (cityId: TransportCity = TransportCity.Kremenchuk) => {
    const getCity = async () => apiReq({ path: `/cities/${cityId}` });

    // Routes

    const getRoutes = async (): Promise<TransportRoute[]> =>
      (await apiReq<TransportDataSourceRoute[]>({ path: `/cities/${cityId}/routes` })).map(parseDataSourceRoute);

    const getRoutesCount = async () => apiReq({ path: `/cities/${cityId}/routeamount` });

    const findRoute = async (from: LatLng, to: LatLng) => {
      const qs = {
        sourceLat: from.lat,
        sourceLng: from.lng,
        targetLat: to.lat,
        targetLng: to.lng,
      };
      return apiReq({ path: `/cities/${cityId}/pathsbwpoints`, qs });
    };

    // Stations

    const getRouteStations = async (rid: number): Promise<TransportStation[]> =>
      (await apiReq<TransportDataSourceStation[]>({ path: `/cities/${cityId}/routes/${rid}/stations` })).map(
        parseDataSourceStation,
      );

    const getRoutesStations = async (rids: number[]): Promise<TransportStation[]> =>
      flatten(await Promise.all(rids.map(getRouteStations)));

    const getStationPrediction = async (sid: number) =>
      (await apiReq<TransportDataSourcePrediction[]>({ path: `/cities/${cityId}/stations/${sid}/prediction` })).map(
        parseDataSourcePrediction,
      );

    // Busses

    const getBusesCount = async () => apiReq({ path: `/cities/${cityId}/busamount` });

    const getRouteBuses = async (rid: number) =>
      (await apiReq<TransportDataSourceBus[]>({ path: `/cities/${cityId}/routes/${rid}/busses` })).map(
        parseDataSourceBus,
      );

    const getRoutesBuses = async (rids: number[] = defTransportRoutesIds) => {
      const arr = await Promise.all(rids.map(rid => getRouteBuses(rid)));
      const buses: TransportBus[] = [];
      arr.forEach(routeBuses => buses.push(...routeBuses));
      return buses;
    };

    const getRoutesBusesUpdate = async (rids: number[]): Promise<TransportBusesCompactUpdate> => {
      const buses = await getRoutesBuses(rids);
      let res: TransportBusesCompactUpdate = {};
      buses.forEach(bus => {
        res = { ...res, ...busToCompactUpdate(bus) };
      });
      return res;
    };

    return {
      getCity,
      getRoutes,
      getRoutesCount,
      getRouteStations,
      findRoute,
      getBusesCount,
      getRouteBuses,
      getRoutesBuses,
      getRoutesBusesUpdate,
      getRoutesStations,
      getStationPrediction,
    };
  };

  return { getCountries, getCitites, withCity };
};

export * from './consts';
export * from './types';
export * from './utils';

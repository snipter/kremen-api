export interface ITransportRouteRaw {
  cityId: number;
  location: string;
  busreportRouteId: number;
  bussesOnRoute: number;
  routeName: string;
  routeNumber: string;  
}

export interface ITransportRoute {
  rid: number;
  location: string;
  active: number;
  name: string;
  number: string;  
}

export interface ITransportBusRaw {
  busreportRouteId: number
  cityId: number;
  direction: number;
  imei: string;
  invalidAdapted: boolean;
  lat: number;
  lon: number;
  name: string;
  offline: boolean;
  speed: number;
}

export interface ITransportBus {
  tid: string;
  rid: number;
  direction: number;
  invalidAdapted: boolean;
  lat: number;
  lng: number;
  name: string;
  offline: boolean;
  speed: number;
}

export interface ITransportBusShort {
  [id: string]: number[];
}

export interface ITransportStationRaw {
  id: number;
  routeId: number;
  lat: number;
  lon: number;
  name: string;
  sequenceNumber: number;
  directionForward: boolean;
}

export interface ITransportStation {
  sid: number;
  rid: number;
  lat: number;
  lng: number;
  name: string;
  sequenceNumber: number;
  directionForward: boolean;
}

export interface ITransportRouteRaw {
  cityId: number;
  location: string;
  busreportRouteId: number;
  bussesOnRoute: number;
  routeName: string;
  routeNumber: string;  
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

export interface ITransportStationRaw {
  id: number;
  routeId: number;
  lat: number;
  lon: number;
  name: string;
  sequenceNumber: number;
  directionForward: boolean;
}

export interface ITransportPredictionRaw {
  routeId: number;
  stationId: number;
  busIMEI: string;
  reverse: boolean;
  distance: number;
  prediction: number;
  generatedTime: number;
  messageTime: number;
  avgSpeed: number;
  speed: number;
  mainPrediction: boolean;
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

export interface ITransportRoute {
  rid: number;
  path: number[][];
  active: number;
  name: string;
  number: string;  
  stations: ITransportStation[];
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

export interface ITransportBusesUpdate {
  [id: string]: number[];
}

export interface ITransportPrediction {
  rid: number;
  sid: number;
  tid: string;
  reverse: boolean;
  distance: number;
  prediction: number;
  generatedTime: number;
  messageTime: number;
  avgSpeed: number;
  speed: number;
  mainPrediction: boolean;
}

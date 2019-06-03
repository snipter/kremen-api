export interface ITransportRoute {
  cityId: number;
  location: string;
  busreportRouteId: number;
  bussesOnRoute: number;
  routeName: string;
  routeNumber: string;  
}

export interface ITransportBusInfo {
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

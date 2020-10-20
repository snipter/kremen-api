// Geo

export interface LatLng {
  lat: number;
  lng: number;
}

export interface LatLngPolygon {
  outer: LatLng[];
  inner?: LatLng[];
}

// Deputy

export interface Deputy {
  id: string;
  name?: string;
  schedule?: string;
  address?: string;
  fb?: string;
  twitter?: string;
  phones?: string[];
  photos?: string[];
}

export interface DeputysMap {
  [key: string]: Deputy;
}

export interface DeputyDistrict {
  id: string;
  number: number;
  deputies: string[];
  markers: LatLng[];
  stations: DeputyDistrictStation[];
  polygons: LatLngPolygon[];
}

export interface DeputyDistrictStation {
  id: number;
  addresses?: string;
  numberOfVoters: number;
}

import { ILatLng } from 'core';

export const gLatLngToILatLng = (val: google.maps.LatLng): ILatLng => ({
  lat: val.lat(), lng: val.lng(),
});

export const isPointInsidePoligon = (point: ILatLng, vs: ILatLng[]) => {
  let inside: boolean = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i].lat;
    const yi = vs[i].lng;
    const xj = vs[j].lat;
    const yj = vs[j].lng;
    const intersect = ((yi > point.lng) !== (yj > point.lng))
        && (point.lat < (xj - xi) * (point.lng - yi) / (yj - yi) + xi);
    if (intersect) {
      inside = !inside;
    }
  }
  return inside;
};

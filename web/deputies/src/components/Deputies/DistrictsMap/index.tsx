import { Map } from 'components/Geo';
import { DeputyDistrict, LatLng } from 'core';
import React, { FC, ReactNode, RefObject } from 'react';
import { GoogleMap } from 'react-google-maps';
import { ViewStyleProps } from 'styles';

import { DistrictPolygon } from '../DistrictPolygon';

interface Props extends ViewStyleProps {
  children?: ReactNode;
  mapRef?: RefObject<GoogleMap> | ((instance: GoogleMap | null) => void);
  defaultCenter?: LatLng;
  defaultZoom?: number;
  center?: LatLng;
  zoom?: number;
  districts: DeputyDistrict[];
  options?: google.maps.MapOptions;
  onMapClick?: (e: google.maps.MouseEvent | google.maps.IconMouseEvent) => void;
  onMapDblClick?: (e: google.maps.MouseEvent) => void;
  onMapCenterChange?: () => void;
  onMapZoomChange?: () => void;
  onDistrictClick?: (item: DeputyDistrict) => void;
}

export const DistrictsMap: FC<Props> = ({
  style,
  mapRef,
  defaultCenter,
  defaultZoom,
  center,
  zoom,
  onMapClick,
  onMapDblClick,
  onMapCenterChange,
  onMapZoomChange,
  districts,
  onDistrictClick,
  options,
  children,
}) => {
  return (
    <Map
      style={style}
      mapRef={mapRef}
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom}
      center={center}
      options={options}
      zoom={zoom}
      onClick={onMapClick}
      onDblClick={onMapDblClick}
      onCenterChanged={onMapCenterChange}
      onZoomChanged={onMapZoomChange}
    >
      {districts.map(item => (
        <DistrictPolygon key={`DistrictPolygon-${item.id}`} item={item} onClick={onDistrictClick} />
      ))}
      {children}
    </Map>
  );
};

export default DistrictsMap;

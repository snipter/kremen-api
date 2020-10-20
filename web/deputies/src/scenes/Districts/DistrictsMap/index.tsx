import Map from "components/Map";
import { IDistrict, ILatLng } from "core";
import React, { CSSProperties, FC, ReactNode, RefObject } from "react";
import { GoogleMap } from "react-google-maps";
import DistrictPolygon from "./components/DistrictPolygon";

interface Props {
  children?: ReactNode;
  style?: CSSProperties;
  mapRef?: RefObject<GoogleMap> | ((instance: GoogleMap | null) => void);
  defaultCenter?: ILatLng;
  defaultZoom?: number;
  center?: ILatLng;
  zoom?: number;
  districts: IDistrict[];
  options?: google.maps.MapOptions;
  onMapClick?: (e: google.maps.MouseEvent | google.maps.IconMouseEvent) => void;
  onMapDblClick?: (e: google.maps.MouseEvent) => void;
  onMapCenterChange?: () => void;
  onMapZoomChange?: () => void;
  onDistrictClick?: (item: IDistrict) => void;
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
      {districts.map((item) => (
        <DistrictPolygon
          key={`DistrictPolygon-${item.id}`}
          item={item}
          onClick={onDistrictClick}
        />
      ))}
      {children}
    </Map>
  );
};

import { DeputyDistrict, LatLng, LatLngPolygon } from 'core';
import React, { FC } from 'react';
import { Polygon } from 'react-google-maps';
import { colors } from 'styles';
import DistrictMarker from './components/Marker';

interface Props {
  item: DeputyDistrict;
  disabled?: boolean;
  markerSize?: number;
  onClick?: (item: DeputyDistrict) => void;
}

const polygonToPaths = (item: LatLngPolygon): LatLng[][] => {
  const paths: LatLng[][] = [item.outer];
  if (item.inner) {
    paths.push(item.inner);
  }
  return paths;
};

export const DistrictPolygon: FC<Props> = ({ onClick, item, disabled = false, markerSize }) => {
  const handlePolygonClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  const handleMarkerClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  return (
    <>
      {item.polygons.map((polygon, index) => (
        <Polygon
          key={`DistrictPolygon-${item.id}-${index}`}
          paths={polygonToPaths(polygon)}
          draggable={false}
          options={{
            strokeColor: !disabled ? colors.primary : colors.gray,
            strokeOpacity: 1,
            strokeWeight: 1,
            fillColor: !disabled ? colors.primary : colors.gray,
            fillOpacity: 0.2,
          }}
          onClick={handlePolygonClick}
        />
      ))}
      {item.markers.map((position, index) => (
        <DistrictMarker
          key={`DistrictMarker-${item.id}-${index}`}
          label={`${item.number}`}
          position={position}
          size={markerSize}
          onClick={handleMarkerClick}
        />
      ))}
    </>
  );
};

export default DistrictPolygon;

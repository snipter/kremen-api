import { DeputyDistrict, LatLng, LatLngPolygon } from 'core';
import React, { FC } from 'react';
import { Polygon } from 'react-google-maps';
import { colors } from 'styles';
import DistrictMarker from '../DistrictMarker';

interface Props {
  item: DeputyDistrict;
  onClick?: (item: DeputyDistrict) => void;
}

const polygonToPaths = (item: LatLngPolygon): LatLng[][] => {
  const paths: LatLng[][] = [item.outer];
  if (item.inner) {
    paths.push(item.inner);
  }
  return paths;
};

export const DistrictPolygon: FC<Props> = ({ onClick, item }) => {
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
            strokeColor: colors.primary,
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: colors.primary,
            fillOpacity: 0.1,
          }}
          onClick={handlePolygonClick}
        />
      ))}
      {item.markers.map((position, index) => (
        <DistrictMarker
          key={`DistrictMarker-${item.id}-${index}`}
          label={`${item.number}`}
          position={position}
          onClick={handleMarkerClick}
        />
      ))}
    </>
  );
};

export default DistrictPolygon;

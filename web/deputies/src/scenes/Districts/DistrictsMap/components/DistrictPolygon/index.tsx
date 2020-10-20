import { IDistrict, ILatLng, ILatLngPolygon } from "core";
import React, { FC } from "react";
import { Polygon } from "react-google-maps";
import { colors } from "styles";
import DistrictMarker from "./components/DistrictMarker";

interface Props {
  item: IDistrict;
  onClick?: (item: IDistrict) => void;
}

const polygonToPaths = (item: ILatLngPolygon): ILatLng[][] => {
  const paths: ILatLng[][] = [item.outer];
  if (item.inner) {
    paths.push(item.inner);
  }
  return paths;
};

const DistrictPolygon: FC<Props> = ({ onClick, item }) => {
  const onPolygonClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  const onMarkerClick = () => {
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
            strokeColor: colors.blue,
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: colors.blue,
            fillOpacity: 0.1,
          }}
          onClick={onPolygonClick}
        />
      ))}
      {item.markers.map((position, index) => (
        <DistrictMarker
          key={`DistrictMarker-${item.id}-${index}`}
          label={`${item.number}`}
          position={position}
          onClick={onMarkerClick}
        />
      ))}
    </>
  );
};

export default DistrictPolygon;

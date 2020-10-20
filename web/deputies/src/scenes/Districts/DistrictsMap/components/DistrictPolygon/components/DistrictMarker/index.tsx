import { ILatLng } from "core";
import React, { FC } from "react";
import { Marker } from "react-google-maps";
import { colors } from "styles";
import IconMarker from "./assets/icon-marker.svg";

interface Props {
  position: ILatLng;
  label: string;
  onClick?: () => void;
}

const DistrictMarker: FC<Props> = ({ position, label, onClick }) => {
  const icon: google.maps.Icon = {
    url: IconMarker,
    size: new google.maps.Size(30, 49),
    labelOrigin: new google.maps.Point(15, 16),
  };
  return (
    <Marker
      position={position}
      icon={icon}
      label={{ text: label, color: colors.white }}
      onClick={onClick}
    />
  );
};

export default DistrictMarker;

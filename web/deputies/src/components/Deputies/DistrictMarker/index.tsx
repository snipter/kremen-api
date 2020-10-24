import { LatLng } from 'core';
import React, { FC } from 'react';
import { Marker } from 'react-google-maps';
import { colors } from 'styles';
import IconMarker from './assets/marker.svg';

interface Props {
  position: LatLng;
  label: string;
  onClick?: () => void;
}

export const DistrictMarker: FC<Props> = ({ position, label, onClick }) => {
  const icon: google.maps.Icon = {
    url: IconMarker,
    size: new google.maps.Size(38, 38),
    labelOrigin: new google.maps.Point(19, 19),
  };
  return <Marker position={position} icon={icon} label={{ text: label, color: colors.white }} onClick={onClick} />;
};

export default DistrictMarker;

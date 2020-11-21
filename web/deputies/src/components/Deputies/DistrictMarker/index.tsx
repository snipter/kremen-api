import { LatLng } from 'core';
import React, { FC } from 'react';
import { Marker } from 'react-google-maps';
import { useTheme } from 'styles';

import IconMarker from './assets/marker.svg';

interface Props {
  position: LatLng;
  label: string;
  size?: number;
  onClick?: () => void;
}

export const DistrictMarker: FC<Props> = ({ position, label, size = 38, onClick }) => {
  const icon: google.maps.Icon = {
    url: IconMarker,
    size: new google.maps.Size(size, size),
    labelOrigin: new google.maps.Point(Math.round(size / 2), Math.round(size / 2)),
  };
  const theme = useTheme();
  const textColor = theme.palette.text.primary;
  return <Marker position={position} icon={icon} label={{ text: label, color: textColor }} onClick={onClick} />;
};

export default DistrictMarker;

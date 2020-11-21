/* eslint-disable max-len */
import { LatLng } from 'core';
import React, { FC } from 'react';
import { Marker } from 'react-google-maps';
import { useTheme } from 'styles';

interface Props {
  position: LatLng;
  label: string;
  size?: number;
  onClick?: () => void;
}

export const DistrictMarker: FC<Props> = ({ position, label, size = 38, onClick }) => {
  const getIconUrl = () => {
    const iconCode = btoa(`<?xml version="1.0" encoding="UTF-8"?>
      <svg width="${size}px" height="${size}px" viewBox="0 0 38 38" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <path fill="#ECB400" stroke="#785C00" d="M19,6.5 C22.4517797,6.5 25.5767797,7.89911016 27.8388348,10.1611652 C30.1008898,12.4232203 31.5,15.5482203 31.5,19 C31.5,21.4500858 30.7952391,23.7355981 29.5770839,25.6646471 C28.2975477,27.6908979 26.4519504,29.3240435 24.2623333,30.3417702 L24.2623333,30.3417702 L19.0000449,37.1800813 L13.7396607,30.3426968 C11.5494936,29.3251853 9.70338629,27.6919956 8.42348348,25.6655455 C7.2049798,23.7363077 6.5,21.4504662 6.5,19 C6.5,15.5482203 7.89911016,12.4232203 10.1611652,10.1611652 C12.4232203,7.89911016 15.5482203,6.5 19,6.5 Z"></path>
      </svg>
    `);
    return `data:image/svg+xml;base64,${iconCode}`;
  };

  const icon: google.maps.Icon = {
    url: getIconUrl(),
    size: new google.maps.Size(size, size),
    anchor: new google.maps.Point(Math.round(size / 2), Math.round(size / 2)),
    labelOrigin: new google.maps.Point(Math.round(size / 2), Math.round(size / 2)),
  };
  const theme = useTheme();
  const textColor = theme.palette.text.primary;
  return <Marker position={position} icon={icon} label={{ text: label, color: textColor }} onClick={onClick} />;
};

export default DistrictMarker;

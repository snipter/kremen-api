import React, { FC } from 'react';
import { Polyline } from 'react-google-maps';
import { ColorsSet } from 'styles';
import { TransportRoute } from 'core/api';

interface Props {
  route: TransportRoute;
  colors: ColorsSet;
}

export const RoutePath: FC<Props> = ({ route, colors }) => {
  const path = route.path.map(([lat, lng]) => ({ lat, lng }));
  return (
    <Polyline path={path} options={{ strokeWeight: 5, strokeColor: colors.light, strokeOpacity: 0.7, zIndex: 0 }} />
  );
};

export default RoutePath;

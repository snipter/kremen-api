import { TransportRoute } from 'core/api';
import { m, Style, Styles, View } from '@kremen/react';
import { clearRouteNumber, routeNumberToColor } from 'core';
import React, { FC } from 'react';
import { colors, ColorsSet } from 'styles';

interface Props {
  style?: Style;
  route: TransportRoute;
  size?: number;
}

export const RouteCircle: FC<Props> = ({ style, route, size }) => {
  const text = clearRouteNumber(route.number);
  const colorsSet = routeNumberToColor(route.number);
  const fontSize = basicFontSize(text);
  const styles = getStyles(size, colorsSet, fontSize);
  return <View style={m(styles.container, style)}>{text}</View>;
};

const basicFontSize = (text: string): number => {
  if (text.length === 1) {
    return 14;
  }
  if (text.length === 2) {
    return 12;
  }
  if (text.length === 3) {
    return 10;
  }
  if (text.length === 4) {
    return 10;
  }
  return 10;
};

const getStyles = (size: number = 24, colorsSet: ColorsSet, fontSize: number): Styles => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: size,
    height: size,
    borderRadius: '50%',
    fontSize: `${fontSize * (size / 24)}px`,
    backgroundColor: colorsSet.light,
    color: colors.white,
  },
});

export default RouteCircle;

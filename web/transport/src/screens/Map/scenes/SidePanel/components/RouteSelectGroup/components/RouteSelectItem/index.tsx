import { TransportRoute } from 'core/api';
import { m, Style, Styles } from 'styles';
import { Checkbox, View } from 'components/Common';
import { clearRouteNumber, routeNumberToColor } from 'core';
import React, { FC } from 'react';

interface Props {
  style?: Style;
  checked?: boolean;
  route: TransportRoute;
  onChange: (route: TransportRoute, val: boolean) => void;
}

export const RouteSelectItem: FC<Props> = ({ style, checked, route, onChange }) => (
  <View style={m(styles.container, style)} row={true}>
    <Checkbox
      checked={checked}
      color={routeNumberToColor(route.number).light}
      onChange={(val: boolean) => onChange(route, val)}
    />
    <div style={styles.title}>{clearRouteNumber(route.number)}</div>
  </View>
);

const styles: Styles = {
  container: {
    alignItems: 'center',
  },
  title: {
    marginLeft: 10,
  },
};

export default RouteSelectItem;

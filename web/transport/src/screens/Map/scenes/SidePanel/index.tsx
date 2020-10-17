import { TransportBus, TransportRoute } from '@kremen/core';
import { m, Style, Styles, View } from '@kremen/react';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import IconEdit from '@material-ui/icons/KeyboardArrowDown';
import IconClose from '@material-ui/icons/KeyboardArrowUp';
import { Collapse, Link } from 'components/Common';
import { RouteCircle } from 'components/Transport';
import { sortRoutes, track } from 'core';
import { compact, groupBy } from 'lodash';
import React, { FC, useState } from 'react';
import { colors } from 'styles';

import RouteSelectGroup from './components/RouteSelectGroup';

interface Props {
  style?: Style;
  routes: TransportRoute[];
  buses: TransportBus[];
  selected: number[];
  onAboutClick: () => void;
  onSelectedChange: (selected: number[]) => void;
}

export const SidePanel: FC<Props> = ({ style, routes, buses, selected, onSelectedChange, onAboutClick }) => {
  const [editOpen, setEditOpen] = useState<boolean>(false);

  const handleEditBtnClick = () => {
    track('RoutesSidebarToggle');
    setEditOpen(!editOpen);
  };

  const { troutes = [], broutes = [] } = groupBy(routes, route =>
    route.number.indexOf('Т') === -1 ? 'broutes' : 'troutes',
  );
  const selectedRoutes = sortRoutes(compact(selected.map(rid => routes.find(item => item.rid === rid))));

  return (
    <Paper style={m(styles.container, style)}>
      <View row={true}>
        <View style={styles.circlesWrap} row={true}>
          {selectedRoutes.map(route => (
            <RouteCircle key={route.rid} style={styles.circle} route={route} />
          ))}
        </View>
        <IconButton style={styles.editBtn} onClick={handleEditBtnClick}>
          {editOpen ? <IconClose fontSize="inherit" /> : <IconEdit fontSize="inherit" />}
        </IconButton>
      </View>
      <Collapse style={styles.gropusWrap} opened={editOpen}>
        <RouteSelectGroup title="Тролейбуси" routes={troutes} selected={selected} onSelectedChange={onSelectedChange} />
        <RouteSelectGroup title="Маршрутки" routes={broutes} selected={selected} onSelectedChange={onSelectedChange} />
        <View style={styles.about} row={true} justifyContent="center">
          <Link onClick={onAboutClick}>Про додаток</Link>
        </View>
        <View style={styles.footer} row={true} justifyContent="space-between">
          <View style={m(styles.footerItem, styles.total)}>{`Всього: ${buses.length}`}</View>
          <View style={styles.footerItem}>{`Активно: ${buses.filter(item => !item.offline).length}`}</View>
          <View style={m(styles.footerItem, styles.version)}>{`v${VERSION}`}</View>
        </View>
      </Collapse>
    </Paper>
  );
};

const styles: Styles = {
  container: {
    backgroundColor: colors.withAlpha('#ffffff', 0.7),
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 8,
    paddingRight: 8,
  },
  link: {
    fontSize: '12px',
  },
  editBtn: {
    marginTop: 5,
    width: 24,
    height: 24,
    fontSize: '24px',
    padding: 0,
  },
  circlesWrap: {
    flex: 1,
    flexWrap: 'wrap',
  },
  circle: {
    marginRight: 5,
    marginTop: 5,
  },
  gropusWrap: {
    paddingTop: 7,
  },
  footer: {
    marginTop: 10,
    fontSize: '10px',
    fontWeight: 'bold',
  },
  footerItem: {
    flex: 1,
    textAlign: 'center',
  },
  total: {
    textAlign: 'left',
  },
  about: {
    fontSize: '12px',
    marginTop: 10,
  },
  version: {
    textAlign: 'right',
  },
};

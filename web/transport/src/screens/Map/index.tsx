/* eslint-disable @typescript-eslint/no-explicit-any */
import { View } from 'components/Common';
import DocTitle from 'components/DocTitle';
import Map from 'components/Map';
import { BusMarker, RoutePath, StationMarker } from 'components/Transport';
import { coordinates, routeNumberToColor, track } from 'core';
import { TransportBus, TransportRoute, TransportStation } from 'core/api';
import { includes, uniqBy } from 'lodash';
import React, { PureComponent } from 'react';
import { GoogleMap } from 'react-google-maps';
import { connect } from 'react-redux';
import { manager } from 'store';
import { fullScreen, m, Style, Styles } from 'styles';
import { LatLng, Log, Timer } from 'utils';

import LogoIqHubBlack from './assets/logo-iqhub-black.svg';
import AboutDialog from './scenes/AboutDialog';
import { SidePanel } from './scenes/SidePanel';
import {
  getMapCenterConf,
  getMapZoomConf,
  getSelectedRoutesConf,
  setMapCenterConf,
  setMapZoomConf,
  setSelectedRoutesConf,
} from './utils';

const log = Log('screens.MapScreen');

const routesToStatiosn = (routes: TransportRoute[]): TransportStation[] => {
  const stations: TransportStation[] = [];
  routes.forEach(route => {
    stations.push(...route.stations);
  });
  return uniqBy(stations, station => station.sid);
};

interface ConnectedProps {
  routes: TransportRoute[];
  buses: TransportBus[];
}

interface OwnProps {
  style?: Style;
}

type Props = ConnectedProps & OwnProps;

interface State {
  center?: LatLng;
  aboutOpen: boolean;
  displayerRoutes: number[];
  busPopupId: string | null;
  stationPopupId: number | null;
}

class MapScreen extends PureComponent<Props, State> {
  private map: GoogleMap | null = null;
  private busesUpdateTimer: Timer | null = null;

  state: State = {
    displayerRoutes: getSelectedRoutesConf([189, 188, 192, 187, 190, 191]),
    aboutOpen: false,
    busPopupId: null,
    stationPopupId: null,
  };

  public componentDidMount() {
    track('MapScreenVisit');
    manager.transportDataUpdate();
    this.busesUpdateTimer = new Timer(() => this.updateBusesState(), 3000, false);
    this.busesUpdateTimer.start(false);
  }

  public componentWillUnmount() {
    if (this.busesUpdateTimer) {
      this.busesUpdateTimer.stop();
      this.busesUpdateTimer = null;
    }
  }

  // Data

  private async updateBusesState() {
    return manager.transportBusesUpdateState(this.state.displayerRoutes);
  }

  // Map

  private onMapRef = (el: GoogleMap | null) => {
    if (this.map || !el) {
      return;
    }
    this.map = el;
  };

  private onMapZoomChanged = () => {
    if (!this.map) {
      return;
    }
    const zoom = this.map.getZoom();
    if (isNaN(zoom)) {
      return;
    }
    log.debug(`zoom changed: ${zoom}`);
    setMapZoomConf(zoom);
  };

  private onMapCenterChanged = () => {
    if (!this.map) {
      return;
    }
    const coord = this.map.getCenter();
    const lat = coord.lat();
    const lng = coord.lng();
    if (!lat || !lng) {
      return;
    }
    setMapCenterConf({ lat, lng });
  };

  private onMapClick = () => {
    track('MapClick');
    log.debug('map click');
    this.setState({ busPopupId: null, stationPopupId: null });
  };

  private onDisplayedRoutesChange = (displayerRoutes: number[]) => {
    track('DisplayedRoutesChange', { routes: displayerRoutes });
    setSelectedRoutesConf(displayerRoutes);
    this.setState({ displayerRoutes });
  };

  // Bus

  private onBusMarkerClick = (bus: TransportBus) => {
    log.info('bus marker click, bus=', bus);
    track('BusMarkerClick', { tid: bus.tid, rid: bus.rid, name: bus.name });
    this.setState({ busPopupId: bus.tid, stationPopupId: null });
  };

  private onBusMarkerPopupClose = () => {
    this.setState({ busPopupId: null });
  };

  // Station

  private onStationMarkerClick = (station: TransportStation) => {
    log.info('station marker click, station=', station);
    track('StationMarkerClick', { sid: station.sid, name: station.name });
    this.setState({ stationPopupId: station.sid, busPopupId: null });
  };

  private onStationMarkerPopupClose = () => {
    this.setState({ stationPopupId: null });
  };

  // About dialog

  private onAboutClick = () => {
    track('AboutBtnClick');
    this.setState({ aboutOpen: true });
  };

  private onAboutClose = () => {
    this.setState({ aboutOpen: false });
  };

  // Render

  public render() {
    const { style, routes: allRoutes, buses: allBuses } = this.props;
    const { center, displayerRoutes, busPopupId, stationPopupId, aboutOpen } = this.state;
    const mapOpt: any = {
      fullscreenControl: false,
      mapTypeControlOptions: {
        mapTypeIds: ['HYBRID', 'SATELLITE'],
        position: 'TOP_RIGHT',
        style: 'DEFAULT',
      },
    };
    const routes = allRoutes.filter(({ rid }) => includes(displayerRoutes, rid));
    const buses = allBuses.filter(({ rid }) => includes(displayerRoutes, rid));
    const stations = routesToStatiosn(routes);
    return (
      <View style={m(styles.container, style)}>
        <DocTitle title={'Транспорт'} />
        <Map
          mapRef={this.onMapRef}
          style={styles.map}
          defaultZoom={getMapZoomConf(14)}
          defaultCenter={getMapCenterConf(coordinates.kremen)}
          options={mapOpt}
          onZoomChanged={this.onMapZoomChanged}
          onCenterChanged={this.onMapCenterChanged}
          onClick={this.onMapClick}
          center={center || getMapCenterConf(coordinates.kremen)}
        >
          {buses.map(bus => (
            <BusMarker
              key={`bus-${bus.tid}`}
              bus={bus}
              route={manager.routeWithId(bus.rid)}
              colors={manager.routeIdToColors(bus.rid)}
              popupOpen={bus.tid === busPopupId}
              onClick={this.onBusMarkerClick}
              onPopupClose={this.onBusMarkerPopupClose}
            />
          ))}
          {routes.map(route => (
            <RoutePath key={`path-${route.rid}`} route={route} colors={routeNumberToColor(route.number)} />
          ))}
          {stations.map(station => (
            <StationMarker
              key={`station-${station.rid}-${station.sid}`}
              station={station}
              selectedRoutes={displayerRoutes}
              route={manager.routeWithId(station.rid)}
              popupOpen={station.sid === stationPopupId}
              onClick={this.onStationMarkerClick}
              onPopupClose={this.onStationMarkerPopupClose}
            />
          ))}
        </Map>
        <SidePanel
          style={styles.sidebar}
          buses={allBuses}
          routes={allRoutes}
          selected={displayerRoutes}
          onSelectedChange={this.onDisplayedRoutesChange}
          onAboutClick={this.onAboutClick}
        />
        <AboutDialog open={aboutOpen} onClose={this.onAboutClose} />
        <View style={styles.footer}>
          <a className="link-img-opacity" href="https://io.kr.ua/" target="__blank">
            <img style={styles.footerImg} src={LogoIqHubBlack} />
          </a>
        </View>
      </View>
    );
  }
}

const styles: Styles = {
  container: {
    ...fullScreen,
    overflow: 'hidden',
  },
  map: {
    ...fullScreen,
  },
  sidebar: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 260,
    zIndex: 2,
    overflowY: 'scroll',
  },
  footer: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    bottom: 10,
  },
  footerImg: {
    width: '80px',
  },
};

export default connect<ConnectedProps, {}, OwnProps>(() => ({
  routes: manager.transportRoutes(),
  buses: manager.state.transport.buses,
}))(MapScreen);

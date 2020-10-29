/* eslint-disable @typescript-eslint/no-explicit-any */
import { View } from 'components/Common';
import DocTitle from 'components/DocTitle';
import { Map } from 'components/Geo';
import { BusMarker, RoutePath, StationMarker } from 'components/Transport';
import { coordinates, defRoutePathColors, findRouteWithId, routeIdToColor, routeToColor, track } from 'core';
import { TransportBus, TransportRoute, TransportStation } from 'core/api';
import { useWebScockets } from 'core/ws';
import { includes, uniqBy } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { GoogleMap } from 'react-google-maps';
import { useSelector, useStoreManager } from 'store';
import { fullScreen, m, Styles, ViewStyleProps } from 'styles';
import { LatLng, Log } from 'utils';

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

type Props = ViewStyleProps;

export const MapScreen: FC<Props> = ({ style }) => {
  const mapRef = useRef<GoogleMap>(null);

  const manager = useStoreManager();
  const allRoutes = useSelector(s => s.transport.routes);
  const allBuses = useSelector(s => s.transport.buses);

  const [center, setCenter] = useState<LatLng | undefined>(undefined);
  const [selectedBus, setSelectedBus] = useState<TransportBus | undefined>(undefined);
  const [stationPopupId, setStationPopupId] = useState<number | undefined>(undefined);
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);
  const [displayedRoutes, setDisplayedRoutes] = useState<number[]>(
    getSelectedRoutesConf([189, 188, 192, 187, 190, 191]),
  );

  useEffect(() => {
    track('MapScreenVisit');
    manager.updateCommonData();
  }, []);

  useWebScockets({
    onMessage: msg => {
      if (msg.type === 'buses') {
        log.debug('ws buses update');
        manager.modBuses(msg.data);
      }
    },
  });

  // Map

  const handleMapZoomChanged = () => {
    if (!mapRef.current) {
      return;
    }
    const zoom = mapRef.current.getZoom();
    if (isNaN(zoom)) {
      return;
    }
    log.debug(`zoom changed: ${zoom}`);
    setMapZoomConf(zoom);
  };

  const handleMapCenterChanged = () => {
    if (!mapRef.current) {
      return;
    }
    const coord = mapRef.current.getCenter();
    const lat = coord.lat();
    const lng = coord.lng();
    if (!lat || !lng) {
      return;
    }
    setMapCenterConf({ lat, lng });
  };

  const handleMapClick = () => {
    track('MapClick');
    log.debug('map click');
    setSelectedBus(undefined);
    setStationPopupId(undefined);
  };

  const handleDisplayedRoutesChange = (val: number[]) => {
    track('DisplayedRoutesChange', { routes: val });
    setSelectedRoutesConf(val);
    setDisplayedRoutes(val);
  };

  // Bus

  const handleBusMarkerClick = (bus: TransportBus) => {
    log.info('bus marker click, bus=', bus);
    track('BusMarkerClick', { tid: bus.tid, rid: bus.rid, name: bus.name });
    setSelectedBus(bus);
    setStationPopupId(undefined);
  };

  const handleBusMarkerPopupClose = () => setSelectedBus(undefined);

  // Station

  const handleStationMarkerClick = (station: TransportStation) => {
    log.info('station marker click, station=', station);
    track('StationMarkerClick', { sid: station.sid, name: station.name });
    setStationPopupId(station.sid);
    setSelectedBus(undefined);
  };

  const handleStationMarkerPopupClose = () => {
    setStationPopupId(undefined);
  };

  // About dialog

  const handleAboutPress = () => {
    track('AboutBtnClick');
    setAboutOpen(true);
  };

  // Render

  const routes = allRoutes.filter(({ rid }) => includes(displayedRoutes, rid));
  const buses = allBuses.filter(({ rid }) => includes(displayedRoutes, rid));
  const stations = routesToStatiosn(routes);

  const renderRoutePath = (route: TransportRoute) => {
    let colors = defRoutePathColors;
    let opacity = 0.5;
    let zIndex = 1;
    if (selectedBus) {
      if (selectedBus.rid === route.rid) {
        opacity = 1.0;
        zIndex = 2;
        colors = routeToColor(route);
      } else {
        opacity = 0.3;
        colors = defRoutePathColors;
      }
    }
    return <RoutePath key={`path-${route.rid}`} route={route} colors={colors} opacity={opacity} zIndex={zIndex} />;
  };

  const renderBusMarker = (bus: TransportBus) => {
    const colors = routeIdToColor(bus.rid, allRoutes);
    const route = findRouteWithId(allRoutes, bus.rid);
    let opacity = 1.0;
    let zIndex = 20;
    if (selectedBus) {
      if (selectedBus?.rid !== bus.rid) {
        opacity = 0.5;
      } else {
        zIndex = 21;
      }
    }
    return (
      <BusMarker
        key={`bus-${bus.tid}`}
        bus={bus}
        route={route}
        colors={colors}
        zIndex={zIndex}
        opacity={opacity}
        popupOpen={bus.tid === selectedBus?.tid}
        onClick={handleBusMarkerClick}
        onPopupClose={handleBusMarkerPopupClose}
      />
    );
  };

  const mapOpt: google.maps.MapOptions = {
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false,
  };

  return (
    <View style={m(styles.container, style)}>
      <DocTitle title={APP_TITLE} />
      <Map
        mapRef={mapRef}
        style={styles.map}
        defaultZoom={getMapZoomConf(14)}
        defaultCenter={getMapCenterConf(coordinates.kremen)}
        defaultOptions={mapOpt}
        onZoomChanged={handleMapZoomChanged}
        onCenterChanged={handleMapCenterChanged}
        onClick={handleMapClick}
        center={center || getMapCenterConf(coordinates.kremen)}
      >
        {buses.map(renderBusMarker)}
        {routes.map(renderRoutePath)}
        {stations.map(station => (
          <StationMarker
            key={`station-${station.rid}-${station.sid}`}
            station={station}
            selectedRoutes={displayedRoutes}
            route={findRouteWithId(allRoutes, station.rid)}
            popupOpen={station.sid === stationPopupId}
            onClick={handleStationMarkerClick}
            onPopupClose={handleStationMarkerPopupClose}
          />
        ))}
      </Map>
      <SidePanel
        style={styles.sidebar}
        buses={allBuses}
        routes={allRoutes}
        selected={displayedRoutes}
        onSelectedChange={handleDisplayedRoutesChange}
        onAboutClick={handleAboutPress}
      />
      <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <View style={styles.footer}>
        <a className="link-img-opacity" href="https://kremen.dev/" target="__blank">
          <img style={styles.footerImg} src={LogoIqHubBlack} />
        </a>
      </View>
    </View>
  );
};

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

export default MapScreen;

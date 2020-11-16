/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocTitle, View } from 'components/Common';
import { EquipmentMarker } from 'components/Equipment';
import { Map } from 'components/Geo';
import { ServicesAppBar } from 'components/Services';
import { coordinates, track } from 'core';
import { EquipmentMachine, LatLng } from 'core/api';
import { useWebScockets } from 'core/ws';
import React, { FC, useEffect, useRef, useState } from 'react';
import { GoogleMap } from 'react-google-maps';
import { useSelector, useStoreManager } from 'store';
import { fullScreen, m, Styles, ViewStyleProps } from 'styles';
import { Log } from 'utils';

import { getMapCenterConf, getMapZoomConf, setMapCenterConf, setMapZoomConf } from './utils';

const log = Log('screens.MapScreen');

type Props = ViewStyleProps;

export const MapScreen: FC<Props> = ({ style }) => {
  const mapRef = useRef<GoogleMap>(null);

  const manager = useStoreManager();
  const items = useSelector(s => s.equipment.items);

  const [selectedItem, setSelectedItem] = useState<EquipmentMachine | undefined>(undefined);
  const [center, setCenter] = useState<LatLng | undefined>(undefined);
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);

  useEffect(() => {
    track('MapScreenVisit');
    manager.updateItems();
  }, []);

  useWebScockets({
    onMessage: msg => {
      if (msg.type === 'items') {
        log.debug('ws items update, count=', msg.data.length);
        manager.modItems(msg.data);
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
  };

  const handleAboutPress = () => {
    track('AboutBtnClick');
    setAboutOpen(true);
  };

  // Render

  const renderItemMarker = (item: EquipmentMachine) => {
    const zIndex = 0;
    const opacity = 1;
    return (
      <EquipmentMarker
        key={`item-${item.eid}`}
        item={item}
        zIndex={zIndex}
        opacity={opacity}
        popupOpen={!!selectedItem && selectedItem.eid === item.eid}
        onClick={() => setSelectedItem(item)}
        onPopupClose={() => setSelectedItem(undefined)}
      />
    );
  };

  const mapOpt: google.maps.MapOptions = {
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    styles: [
      {
        featureType: 'poi',
        stylers: [{ visibility: 'off' }],
      },
    ],
  };

  return (
    <View style={m(styles.container, style)}>
      <DocTitle title={APP_TITLE} />
      <ServicesAppBar />
      <Map
        mapRef={mapRef}
        style={styles.map}
        defaultZoom={getMapZoomConf(14)}
        defaultCenter={getMapCenterConf(coordinates.kremen)}
        options={mapOpt}
        onZoomChanged={handleMapZoomChanged}
        onCenterChanged={handleMapCenterChanged}
        onClick={handleMapClick}
        center={center || getMapCenterConf(coordinates.kremen)}
      >
        {items.map(renderItemMarker)}
      </Map>
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
  helpBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
  },
};

export default MapScreen;

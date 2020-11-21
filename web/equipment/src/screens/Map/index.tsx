/* eslint-disable @typescript-eslint/no-explicit-any */
import { ControlRoundBtn, DocTitle, View } from 'components/Common';
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

import { getMapZoomConf, setMapZoomConf } from './utils';

const log = Log('screens.MapScreen');

type Props = ViewStyleProps;

const mapMarkerSize = 46;

export const MapScreen: FC<Props> = ({ style }) => {
  const manager = useStoreManager();
  const items = useSelector(s => s.equipment.items);

  const [selectedItem, setSelectedItem] = useState<EquipmentMachine | undefined>(undefined);

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

  const mapRef = useRef<GoogleMap>(null);

  const [center, setCenter] = useState<LatLng>(coordinates.kremen);
  const [zoom, setZoom] = useState<number>(getMapZoomConf(14));

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
    log.debug('cener changed');
    const coord = mapRef.current.getCenter();
    const lat = coord.lat();
    const lng = coord.lng();
    setCenter({ lat, lng });
  };

  const handleMapClick = () => {
    track('MapClick');
    log.debug('map click');
  };

  const handleZoomInPress = () => {
    if (mapRef.current) {
      setZoomAndSave(mapRef.current.getZoom() + 1);
    }
  };

  const handleZoomOutPress = () => {
    if (mapRef.current) {
      setZoomAndSave(mapRef.current.getZoom() - 1);
    }
  };

  const setZoomAndSave = (val: number) => {
    let newVal = val;
    if (newVal < 0) {
      newVal = 0;
    }
    if (newVal > 22) {
      newVal = 22;
    }
    setZoom(newVal);
    setMapZoomConf(newVal);
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
        size={mapMarkerSize}
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
    zoomControl: false,
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
        defaultOptions={mapOpt}
        defaultZoom={zoom}
        defaultCenter={center}
        center={center}
        zoom={zoom}
        onZoomChanged={handleMapZoomChanged}
        onCenterChanged={handleMapCenterChanged}
        onClick={handleMapClick}
      >
        {items.map(renderItemMarker)}
      </Map>
      <View style={styles.controlsPanel}>
        <ControlRoundBtn style={styles.controlsPanelBtn} icon="plus" onClick={handleZoomInPress} />
        <ControlRoundBtn style={styles.controlsPanelBtn} icon="minus" onClick={handleZoomOutPress} />
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
  controlsPanel: {
    position: 'absolute',
    right: 14,
    bottom: 24,
    zIndex: 2,
  },
  controlsPanelBtn: {
    marginTop: 4,
    marginBottom: 4,
  },
};

export default MapScreen;

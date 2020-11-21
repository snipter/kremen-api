import { createStyles, WithStyles, withStyles } from '@material-ui/core';
import { ControlRoundBtn, DocTitle, Link, View } from 'components/Common';
import { DistrictDialog, DistrictPolygon } from 'components/Deputies';
import { Map } from 'components/Geo';
import { ServicesAppBar } from 'components/Services';
import { DeputyDistrict, getDistrictDeputies, LatLng, track } from 'core';
import { coordinates } from 'core/consts';
import { defDeputies, defDistricts } from 'core/data';
import React, { FC, useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker } from 'react-google-maps';
import { fullScreen, m, mdMaxWidth, ScreenSize, Styles, threeDots, ViewStyleProps } from 'styles';
import { isPointInsidePoligon, Log } from 'utils';

import SearchBar from './components/SearchBar';

const log = Log('screens.Map');

type Props = ViewStyleProps & WithStyles<typeof classNames>;

const mapMarkerSize = 46;

const MapScreen: FC<Props> = ({ style, classes }) => {
  // Data

  const [districtDialogOpen, setDistrictDialogOpen] = useState<boolean>(false);
  const [curDistrict, setCurDistrict] = useState<DeputyDistrict | undefined>();
  const [curLoc, setCurLoc] = useState<LatLng | undefined>();

  const handleDistrictClick = (item: DeputyDistrict) => {
    track('DistrictClick', item);
    log.debug('on district click, item=', item);
    setCurLoc(undefined);
    setCurDistrict(item);
    setDistrictDialogOpen(true);
    if (item.markers.length) {
      setCenter(item.markers[0]);
    }
  };

  const handleDistrictDialogClose = () => {
    setDistrictDialogOpen(false);
  };

  const handleLocationSelect = (val: LatLng) => {
    track('SearchPlaceResultClick', val);
    log.debug('location selected, val=', val);
    const district = defDistricts.find(item => {
      const polygon = item.polygons.find(pItem => isPointInsidePoligon(val, pItem.outer));
      return polygon ? true : false;
    });
    if (district) {
      setCurLoc(val);
      setCenter(val);
      setCurDistrict(district);
      setDistrictDialogOpen(true);
    } else {
      setCurLoc(undefined);
      alert('За заданою адресою виборчий округ не знайдено');
    }
  };

  // Map

  useEffect(() => {
    track('MapScreenVisist');
  }, []);

  const mapRef = useRef<GoogleMap>(null);
  const [center, setCenter] = useState<LatLng>(coordinates.kremen);
  const [zoom, setZoom] = useState<number>(14);

  const handleMapClick = (e: google.maps.MouseEvent | google.maps.IconMouseEvent) => {
    setCurLoc(undefined);
    setCurDistrict(undefined);
    log.debug('map click, loc=', e.latLng);
  };

  const handleMapZoomChanged = () => {
    if (!mapRef.current) {
      return;
    }
    const zoom = mapRef.current.getZoom();
    if (isNaN(zoom)) {
      return;
    }
    log.debug(`zoom changed: ${zoom}`);
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
  };

  // Render

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
    <View style={[styles.container, style]}>
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
        onClick={handleMapClick}
        onCenterChanged={handleMapCenterChanged}
        onZoomChanged={handleMapZoomChanged}
      >
        {defDistricts.map(item => (
          <DistrictPolygon
            key={`DistrictPolygon-${item.id}`}
            item={item}
            disabled={curDistrict && curDistrict.id !== item.id ? true : false}
            markerSize={mapMarkerSize}
            onClick={handleDistrictClick}
          />
        ))}
        {!!curLoc && <Marker position={curLoc} />}
        <SearchBar className={classes.searchBar} onLocationSelect={handleLocationSelect} />
      </Map>
      <View style={styles.controlsPanel}>
        <ControlRoundBtn style={styles.controlsPanelBtn} icon="plus" onClick={handleZoomInPress} />
        <ControlRoundBtn style={styles.controlsPanelBtn} icon="minus" onClick={handleZoomOutPress} />
      </View>
      {!!curDistrict && (
        <DistrictDialog
          open={districtDialogOpen}
          item={curDistrict}
          deputies={getDistrictDeputies(curDistrict, defDeputies)}
          onClose={handleDistrictDialogClose}
        />
      )}
      <View style={styles.footer} justifyContent="center" row={true}>
        <View style={styles.footerItem}>{`v${VERSION}`}</View>
        <Link style={m(styles.noBorder, styles.footerItem)} href="https://kremen.dev/">
          {`#Kremen.Dev © ${new Date().getFullYear()} рік.`}
        </Link>
      </View>
    </View>
  );
};

const classNames = () =>
  createStyles({
    searchBar: {
      position: 'absolute',
      top: 10 + 60,
      left: 10,
      zIndex: 1,
      width: 400,
      [mdMaxWidth(ScreenSize.Phone)]: {
        width: 'inherit',
        right: 10,
      },
    },
  });

const styles: Styles = {
  container: {
    ...fullScreen,
  },
  map: {
    ...fullScreen,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  footerItem: {
    backgroundColor: 'rgba(255, 255, 255, .5)',
    padding: '1px 6px',
    marginLeft: 1,
    marginRight: 1,
    fontSize: 12,
    color: 'black',
    ...threeDots,
  },
  noBorder: {
    border: 'none',
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

export default withStyles(classNames)(MapScreen);

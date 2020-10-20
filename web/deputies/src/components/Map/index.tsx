import React, { CSSProperties, FC, RefObject } from "react";
import {
  GoogleMap,
  GoogleMapProps,
  withGoogleMap,
  withScriptjs,
} from "react-google-maps";
import { Log, qsParamsToStr } from "utils";
const log = Log("components.Map");

interface IMapProps extends GoogleMapProps {
  mapRef?: RefObject<GoogleMap> | ((instance: GoogleMap | null) => void);
}

const Map: FC<IMapProps> = ({ mapRef, ...props }) => {
  const options: google.maps.MapOptions = {
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_RIGHT,
    },
  };
  return <GoogleMap ref={mapRef} {...props} options={options} />;
};

const WrappedMap = withScriptjs(withGoogleMap(Map));

interface IWrappedMapProps extends IMapProps {
  style?: CSSProperties;
  token?: string;
}

const defToken =
  typeof MAPS_API_KEY !== "undefined" && MAPS_API_KEY ? MAPS_API_KEY : null;
if (defToken) {
  log.info(`api token: ${defToken}`);
}

const WrappedMapWithDefault: FC<IWrappedMapProps> = ({
  style,
  token,
  ...props
}) => {
  const curToken = defToken || token;
  if (!curToken) {
    log.warn("empty google maps token");
    return null;
  }
  const qs = qsParamsToStr({ key: curToken, libraries: "geometry,places" });
  return (
    <WrappedMap
      googleMapURL={`https://maps.googleapis.com/maps/api/js?${qs}`}
      loadingElement={<div style={style} />}
      containerElement={<div style={style} />}
      mapElement={<div style={style} />}
      {...props}
    />
  );
};

export default WrappedMapWithDefault;

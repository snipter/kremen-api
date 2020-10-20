import { Paper } from "@material-ui/core";
import { ILatLng } from "core";
import React, { FC, useState } from "react";
import { IStyle, IStyles, m, px } from "styles";
import { gLatLngToILatLng } from "utils";
import PlaceSearch from "./components/PlaceSearch";

interface Props {
  style?: IStyle;
  className?: string;
  onLocationSelect?: (val: ILatLng) => void;
}

const SearchBar: FC<Props> = ({ style, className, onLocationSelect }) => {
  const onPlaceSearcSelect = (val: google.maps.GeocoderResult) => {
    if (!onLocationSelect) {
      return;
    }
    const location = gLatLngToILatLng(val.geometry.location);
    onLocationSelect(location);
  };

  return (
    <Paper className={className} style={m(styles.container, style)}>
      <PlaceSearch style={styles.search} onSelect={onPlaceSearcSelect} />
    </Paper>
  );
};

const styles: IStyles = {
  container: {
    padding: 10,
    paddingLeft: 10,
    paddingRight: 10,
    display: "flex",
    flexDirection: "column",
  },
  search: {
    flex: 1,
  },
};

export default SearchBar;

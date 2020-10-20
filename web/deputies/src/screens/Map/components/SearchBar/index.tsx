import { Paper } from '@material-ui/core';
import { PlaceSearch } from 'components/Geo';
import { LatLng } from 'core';
import React, { FC } from 'react';
import { m, Styles, ViewStyleProps } from 'styles';
import { gLatLngToLatLng } from 'utils';

interface Props extends ViewStyleProps {
  className?: string;
  onLocationSelect?: (val: LatLng) => void;
}

export const SearchBar: FC<Props> = ({ style, className, onLocationSelect }) => {
  const handlePlaceSearcSelect = (val: google.maps.GeocoderResult) => {
    if (!onLocationSelect) {
      return;
    }
    const location = gLatLngToLatLng(val.geometry.location);
    onLocationSelect(location);
  };

  return (
    <Paper className={className} style={m(styles.container, style)}>
      <PlaceSearch style={styles.search} onSelect={handlePlaceSearcSelect} />
    </Paper>
  );
};

const styles: Styles = {
  container: {
    padding: 10,
    paddingLeft: 10,
    paddingRight: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  search: {
    flex: 1,
  },
};

export default SearchBar;

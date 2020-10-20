import { CircularProgress } from '@material-ui/core';
import { View } from 'components/Common';
import { defCoord, LatLng } from 'core';
import React, { FC, useState } from 'react';
import PlacesAutocomplete, { geocodeByPlaceId } from 'react-places-autocomplete';
import { Styles, ViewStyleProps } from 'styles';
import { Log } from 'utils';

import PlaceSearchCloseBtn from './components/CloseBtn';
import { PlaceSearchSuggestion } from './components/Suggestion';

const log = Log('components.PlaceSearch');

interface Props extends ViewStyleProps {
  location?: LatLng;
  radius?: number;
  onSelect?: (value: google.maps.GeocoderResult) => void;
}

export const PlaceSearch: FC<Props> = ({ style, location = defCoord.kremen.loc, radius = 22000, onSelect }) => {
  const [value, setValue] = useState<string>('');

  const handleChange = (newVal: string) => {
    setValue(newVal);
  };

  const handleSelect = async (address: string, placeID: string) => {
    try {
      const results = await geocodeByPlaceId(placeID);
      if (!results || !results.length) {
        return;
      }
      const data = results[0];
      log.debug(data);
      setValue(data.formatted_address);
      if (onSelect) {
        onSelect(data);
      }
    } catch (err) {
      log.err(err.toString());
    }
  };

  const handleClearPress = () => {
    setValue('');
  };

  const searchOptions = {
    location: new google.maps.LatLng(location.lat, location.lng),
    radius,
  };

  return (
    <PlacesAutocomplete value={value} searchOptions={searchOptions} onSelect={handleSelect} onChange={handleChange}>
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <View style={[styles.container, style]} row={true} alignItems="center">
          <input
            {...getInputProps({
              style: styles.input,
              placeholder: 'Пошук за адресою',
            })}
          />
          <View style={styles.progressWrap}>
            {loading && <CircularProgress style={styles.progress} size={20} />}
            {value && !loading && <PlaceSearchCloseBtn onClick={handleClearPress} />}
          </View>
          <View style={styles.dropdown}>
            {suggestions.map(suggestion => {
              const { key, style: itmStyle, ...props } = getSuggestionItemProps(suggestion);
              return <PlaceSearchSuggestion key={key} style={itmStyle} item={suggestion} {...props} />;
            })}
          </View>
        </View>
      )}
    </PlacesAutocomplete>
  );
};

const styles: Styles = {
  container: {
    width: '100%',
  },
  input: {
    display: 'block',
    flex: 1,
    padding: '10px',
    border: 'none',
    fontSize: '15px',
    outline: 'none',
  },
  progressWrap: {
    width: 20,
    height: '100%',
  },
  progress: {},
  dropdown: {
    position: 'absolute',
    top: '100%',
    backgroundColor: 'white',
    width: '100%',
  },
};

export default PlaceSearch;

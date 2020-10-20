import { CircularProgress, IconButton } from "@material-ui/core";
import IconClose from "@material-ui/icons/Close";
import { View } from "components/Common";
import { defCoord } from "core";
import React, { FC, useState } from "react";
import PlacesAutocomplete, {
  geocodeByPlaceId,
} from "react-places-autocomplete";
import { IStyle, IStyles, m } from "styles";
import { Log } from "utils";
const log = Log("components.PlaceSearch");

interface Props {
  style?: IStyle;
  onSelect?: (value: google.maps.GeocoderResult) => void;
}

const PlaceSearch: FC<Props> = ({ style, onSelect }) => {
  const [value, setValue] = useState<string>("");

  const onPlacesAutocompleteValueChange = (newVal: string) => {
    setValue(newVal);
  };

  const onPlacesAutocompleteSelect = async (
    address: string,
    placeID: string
  ) => {
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

  const onClearClick = () => {
    setValue("");
  };

  const searchLoc = defCoord.kremen.loc;
  const searchOptions = {
    location: new google.maps.LatLng(searchLoc.lat, searchLoc.lng),
    radius: 22000,
  };

  return (
    <PlacesAutocomplete
      value={value}
      searchOptions={searchOptions}
      onSelect={onPlacesAutocompleteSelect}
      onChange={onPlacesAutocompleteValueChange}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <View style={[styles.container, style]} row={true} alignItems="center">
          <input
            {...getInputProps({
              style: styles.input,
              placeholder: "Пошук за адресою",
            })}
          />
          <View style={styles.progressWrap}>
            {loading && <CircularProgress style={styles.progress} size={20} />}
            {value && !loading && (
              <IconButton style={styles.closeBtn} onClick={onClearClick}>
                <IconClose style={styles.closeBtnIcon} />
              </IconButton>
            )}
          </View>
          <div style={styles.dropdownContainer}>
            {suggestions.map((suggestion, index) => {
              const activeStyle = suggestion.active
                ? { backgroundColor: "#fafafa", cursor: "pointer" }
                : { backgroundColor: "#ffffff", cursor: "pointer" };
              return (
                <div
                  key={index}
                  {...getSuggestionItemProps(suggestion, {
                    style: m(activeStyle, styles.dropdownItem),
                  })}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </View>
      )}
    </PlacesAutocomplete>
  );
};

const styles: IStyles = {
  container: {
    width: "100%",
  },
  input: {
    display: "block",
    flex: 1,
    padding: "10px",
    border: "none",
    fontSize: "15px",
    outline: "none",
  },
  progressWrap: {
    width: 20,
    height: "100%",
  },
  progress: {},
  dropdownContainer: {
    position: "absolute",
    top: "100%",
    backgroundColor: "white",
    width: "100%",
  },
  dropdownItem: {
    backgroundColor: "#ffffff",
    padding: "8px",
    color: "#333",
    cursor: "pointer",
    fontSize: "13px",
    borderTop: "1px solid #ddd",
  },
  closeBtn: {
    width: 20,
    height: 20,
  },
  closeBtnIcon: {
    width: 16,
    height: 16,
  },
};

export default PlaceSearch;

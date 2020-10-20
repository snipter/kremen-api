import { createStyles, Theme, withStyles, WithStyles } from "@material-ui/core";
import { Link, View } from "components/Common";
import {
  defCoord,
  getConfig,
  getDistrictDeputies,
  IDistrict,
  ILatLng,
  setConfig,
  track,
} from "core";
import { defDeputies, defDistricts } from "core/data";
import { NavPaths } from "navigation/types";
import React, { CSSProperties, PureComponent } from "react";
import { GoogleMap } from "react-google-maps";
import { DistrictDialog, DistrictsMap } from "scenes/Districts";
import {
  fullScreen,
  horizontalCenter,
  IStyles,
  m,
  threeDots,
  mdMaxWidth,
  ScreenSize,
} from "styles";
import { gLatLngToILatLng, isPointInsidePoligon, Log } from "utils";
import Brands from "./components/Brands";
import SearchBar from "./components/SearchBar";
const log = Log("screens.DistrictsMapScreen");

interface Props {
  style?: CSSProperties;
}

interface IState {
  center: ILatLng;
  zoom: number;
  districtDialogOpen: boolean;
  districtDialogItem?: IDistrict;
}

class DistrictsMapScreen extends PureComponent<
  WithStyles<typeof classNames> & Props,
  IState
> {
  private map?: GoogleMap;

  state: IState = {
    center: getConfig<ILatLng>("mapCenter") || defCoord.kremen.loc,
    zoom: getConfig<number>("mapZoom") || defCoord.kremen.zoom,
    districtDialogOpen: false,
    districtDialogItem: undefined,
  };

  public componentDidMount() {
    track("DistrictsMapScreenVisist");
  }

  private onMapRef = (map: GoogleMap | null) => {
    if (!map || this.map) {
      return;
    }
    this.map = map;
  };

  private onMapClick = (
    e: google.maps.MouseEvent | google.maps.IconMouseEvent
  ) => {
    log.debug("map click, loc=", e.latLng);
  };

  private onMapCenterChange = () => {
    if (!this.map) {
      return;
    }
    const center = gLatLngToILatLng(this.map.getCenter());
    setConfig("mapCenter", center);
    this.setState({ center });
  };

  private onMapZoomChange = () => {
    if (!this.map) {
      return;
    }
    const zoom = this.map.getZoom();
    setConfig("mapZoom", zoom);
    this.setState({ zoom });
  };

  private onDistrictClick = (item: IDistrict) => {
    track("DistrictClick", item);
    log.debug("on district click, item=", item);
    this.setState({ districtDialogOpen: true, districtDialogItem: item });
  };

  private onDistrictDialogClose = () => {
    this.setState({ districtDialogOpen: false });
  };

  private onLocationSelect = (val: ILatLng) => {
    track("SearchPlaceResultClick", val);
    log.debug("location selected, val=", val);
    const district = defDistricts.find((item) => {
      const polygon = item.polygons.find((pItem) =>
        isPointInsidePoligon(val, pItem.outer)
      );
      return polygon ? true : false;
    });
    if (district) {
      this.setState({ districtDialogOpen: true, districtDialogItem: district });
    } else {
      alert("За заданою адресою виборчий округ не знайдено");
    }
  };

  render() {
    const { style, classes } = this.props;
    const { center, zoom, districtDialogOpen, districtDialogItem } = this.state;
    return (
      <View style={[styles.container, style]}>
        <DistrictsMap
          style={styles.map}
          mapRef={this.onMapRef}
          defaultCenter={center}
          defaultZoom={zoom}
          districts={defDistricts}
          center={center}
          zoom={zoom}
          onMapClick={this.onMapClick}
          onMapCenterChange={this.onMapCenterChange}
          onMapZoomChange={this.onMapZoomChange}
          onDistrictClick={this.onDistrictClick}
        >
          <SearchBar
            className={classes.searchBar}
            onLocationSelect={this.onLocationSelect}
          />
        </DistrictsMap>
        {!!districtDialogItem && (
          <DistrictDialog
            open={districtDialogOpen}
            item={districtDialogItem}
            deputies={getDistrictDeputies(districtDialogItem, defDeputies)}
            onClose={this.onDistrictDialogClose}
          />
        )}
        <Brands style={styles.brands} />
        <View style={styles.footer} justifyContent="center" row={true}>
          <Link
            style={m(styles.noBorder, styles.footerItem)}
            href={NavPaths.About}
          >
            Про додаток
          </Link>
          <View style={styles.footerItem}>{`v${VERSION}`}</View>
          <Link
            style={m(styles.noBorder, styles.footerItem)}
            href="http://io.kr.ua/"
          >
            {`IQ Hub © ${new Date().getFullYear()} рік.`}
          </Link>
        </View>
      </View>
    );
  }
}

const classNames = (theme: Theme) =>
  createStyles({
    searchBar: {
      position: "absolute",
      top: 10,
      left: 10,
      zIndex: 1,
      width: 400,
      [mdMaxWidth(ScreenSize.Phone)]: {
        width: "inherit",
        right: 10,
      },
    },
  });

const styles: IStyles = {
  container: {
    ...fullScreen,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  footerItem: {
    backgroundColor: "rgba(255, 255, 255, .5)",
    padding: "1px 6px",
    marginLeft: 1,
    marginRight: 1,
    fontSize: 10,
    ...threeDots,
  },
  noBorder: {
    border: "none",
  },
  brands: {
    position: "absolute",
    bottom: 24,
    left: 2,
  },
};

export default withStyles(classNames)(DistrictsMapScreen);

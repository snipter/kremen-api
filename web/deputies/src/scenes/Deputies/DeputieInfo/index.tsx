import IconAddress from "@material-ui/icons/Business";
import IconCalendar from "@material-ui/icons/Event";
import IconFacebook from "@material-ui/icons/Facebook";
import IconPhone from "@material-ui/icons/PhoneIphone";
import IconTwitter from "@material-ui/icons/Twitter";
import { View } from "components/Common";
import { IDeputy } from "core";
import React, { PureComponent } from "react";
import { IStyle, IStyles, px, threeDots } from "styles";
import { capitalizeFirstLetter } from "utils";
import PhotoSlider from "./components/PhotoSlider";

interface Props {
  style?: IStyle;
  item: IDeputy;
}

export class DeputieInfo extends PureComponent<Props> {
  render() {
    const { item, style } = this.props;
    const { name, photos, phones, schedule, address, fb, twitter } = item;
    return (
      <View style={[styles.container, style]} row={true}>
        {photos && photos.length && (
          <View style={styles.photosWrap}>
            <PhotoSlider items={photos} />
          </View>
        )}
        <View style={styles.infoWrap}>
          {!!name && <View style={[styles.row, styles.name]}>{name}</View>}
          {!!schedule && (
            <View style={styles.row} row={true}>
              <IconCalendar style={styles.rowIcon} />
              <View>{capitalizeFirstLetter(schedule)}</View>
            </View>
          )}
          {!!address && (
            <View style={styles.row} row={true}>
              <IconAddress style={styles.rowIcon} />
              <View>{capitalizeFirstLetter(address)}</View>
            </View>
          )}
          {!!fb && (
            <View style={styles.row} row={true}>
              <IconFacebook style={styles.rowIcon} />
              <View style={styles.fb}>
                <a href={fb} target="__blank">
                  {fb}
                </a>
              </View>
            </View>
          )}
          {!!twitter && (
            <View style={styles.row} row={true}>
              <IconTwitter style={styles.rowIcon} />
              <View>
                <a href={twitter} target="__blank">
                  {twitter}
                </a>
              </View>
            </View>
          )}
          {phones &&
            phones.length &&
            phones.map((phone, key) => (
              <View key={key} style={styles.row} row={true}>
                <IconPhone style={styles.rowIcon} />
                <View>
                  <a href={`tel:${phone}`} target="__blank">
                    {phone}
                  </a>
                </View>
              </View>
            ))}
        </View>
      </View>
    );
  }
}

const styles: IStyles = {
  container: {},
  photosWrap: {
    marginRight: 12,
    textAlign: "center",
  },
  infoWrap: {
    flex: 1,
  },
  row: {
    marginTop: 12,
  },
  rowIcon: {
    marginRight: 6,
  },
  name: {
    fontWeight: "bold",
    fontSize: px(18),
  },
  fb: {
    ...threeDots,
    width: 260,
  },
};

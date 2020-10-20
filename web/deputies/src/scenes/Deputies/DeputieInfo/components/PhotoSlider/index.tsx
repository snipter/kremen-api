import { View } from "components/Common";
import React, { PureComponent } from "react";
import { IStyle, IStyles } from "styles";

interface Props {
  style?: IStyle;
  items: string[];
}

export default class PhotoSlider extends PureComponent<Props> {
  public render() {
    const { items, style } = this.props;
    if (!items.length) {
      return null;
    }
    return (
      <View style={[styles.container, style]}>
        <img src={items[0]} style={styles.img} alt="Фото депутата" />
      </View>
    );
  }
}

const styles: IStyles = {
  container: {
    textAlign: "center",
  },
  img: {
    maxWidth: "100%",
    maxHeight: "300px",
    display: "inline-block",
  },
};

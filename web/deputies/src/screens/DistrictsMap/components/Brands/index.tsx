import { Image, View } from "components/Common";
import React, { FC } from "react";
import { IStyle, IStyles } from "styles";
import LogoIQHub from "./assets/iqhub-logo-300w.png";
import LogoVestnik from "./assets/vestnik-logo-300w.png";

interface Props {
  style?: IStyle;
}

const Brands: FC<Props> = ({ style }) => {
  const items = [
    {
      icon: LogoIQHub,
      title: "IQ Hub",
      link: "https://io.kr.ua/",
    },
    {
      icon: LogoVestnik,
      title: "Вісник Кременчука",
      link: "https://vestnik.in.ua/",
    },
  ];

  return (
    <View style={[styles.container, style]} column={true} alignItems="center">
      {items.map(({ icon, title, link }, index) => (
        <View key={index} style={styles.item}>
          <a href={link} target="__blank" style={styles.link}>
            <Image src={icon} alt={title} width={64} />
          </a>
        </View>
      ))}
    </View>
  );
};

const styles: IStyles = {
  container: {},
  item: {
    paddingLeft: "5px",
    paddingRight: "5px",
  },
  link: {
    borderBottom: "none",
    cursor: "pointer",
  },
};

export default Brands;

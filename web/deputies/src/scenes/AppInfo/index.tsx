import { Image, Link, View } from "components/Common";
import React, { FC } from "react";
import { IStyle, IStyles, m } from "styles";
import IconEmail from "./assets/icon-email.svg";
import LogoFacebook from "./assets/logo-fb.svg";
import LogoGithub from "./assets/logo-github.svg";
import LogoSlack from "./assets/logo-slack.svg";
import LogoVestnik from "./assets/logo-vestnik-300w.png";

interface Props {
  style?: IStyle;
}

const AppInfo: FC<Props> = ({ style }) => {
  return (
    <View style={m(styles.container, style)}>
      <p>
        Карта виборчих округів дозволяє вам дізнатись хто є депутатом вашого
        району та як з ним зв&#39;язатись.
      </p>
      <p>
        Додаток не є комерційним і створений завласної ініціативи кременчуцьких
        програмістів місцевої IT-спільноти{" "}
        <Link href="http://io.kr.ua/">IQ Hub</Link>.
      </p>
      <p>
        <a href="/rights">Права, обов‘язки та відповідальність депутата</a>
      </p>
      <p>Хочеш допомогти? Є ідеї або зауваження? Не вірна інформація? Пиши:</p>
      <p style={styles.contactRow}>
        <Image style={styles.icon} src={IconEmail} />
        <Link email="websnipter@gmail.com">websnipter@gmail.com</Link>
      </p>
      <p style={styles.contactRow}>
        <Image style={styles.icon} src={LogoFacebook} />
        <Link href="https://fb.me/snipter/">fb.me/snipter</Link>
      </p>
      <p style={styles.contactRow}>
        <Image style={styles.icon} src={LogoSlack} />
        <Link href="https://slack.io.kr.ua/">slack.io.kr.ua</Link>
      </p>
      <p style={styles.contactRow}>
        <Image style={styles.icon} src={LogoGithub} />
        <Link href="https://github.com/iq-hub/kremen-constituencies-web">
          github.com/iq-hub/kremen-constituencies-web
        </Link>
      </p>
      <p>Партнер проекту:</p>
      <p>
        <a
          href="https://vestnik.in.ua/"
          target="__blank"
          style={styles.logoLink}
        >
          <img
            src={LogoVestnik}
            style={styles.logoImg}
            alt="Вісник Кременчука"
          />
        </a>
      </p>
    </View>
  );
};

const styles: IStyles = {
  container: {},
  contactRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  logoLink: {
    borderBottom: "none",
  },
  logoImg: {
    width: "160px",
  },
  icon: {
    height: 15,
    marginRight: 6,
  },
  center: {
    textAlign: "center",
  },
};

export default AppInfo;

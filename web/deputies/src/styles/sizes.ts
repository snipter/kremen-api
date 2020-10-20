const screens = {
  phone: 576,
  tablet: 768,
  desktop: 992,
  largegDesktop: 1200,
};

export enum ScreenSize {
  Phone, Tablet, Desktop, LargeDesctop,
}

export const getScreenSizePixels = (val: ScreenSize) => {
  switch (val) {
    case ScreenSize.Phone: return screens.phone;
    case ScreenSize.Tablet: return screens.tablet;
    case ScreenSize.Desktop: return screens.desktop;
    case ScreenSize.LargeDesctop: return screens.largegDesktop;
  }
};

export const mdMaxWidth = (val: ScreenSize) => (
  `@media (max-width: ${getScreenSizePixels(val)}px)`
);

export const mdMinWidth = (val: ScreenSize) => (
  `@media (min-width: ${getScreenSizePixels(val)}px)`
);

export const sizes = { screens };

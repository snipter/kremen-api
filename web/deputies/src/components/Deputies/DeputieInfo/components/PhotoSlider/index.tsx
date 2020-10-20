import { View } from 'components/Common';
import React, { FC } from 'react';
import { Styles, ViewStyleProps } from 'styles';

interface Props extends ViewStyleProps {
  items: string[];
}

export const PhotoSlider: FC<Props> = ({ items, style }) => {
  if (!items.length) {
    return null;
  }
  return (
    <View style={[styles.container, style]}>
      <img src={items[0]} style={styles.img} alt="Фото депутата" />
    </View>
  );
};

const styles: Styles = {
  container: {
    textAlign: 'center',
  },
  img: {
    maxWidth: '100%',
    maxHeight: '300px',
    display: 'inline-block',
  },
};

export default PhotoSlider;

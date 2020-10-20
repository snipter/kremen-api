import { IconButton } from '@material-ui/core';
import IconClose from '@material-ui/icons/Close';
import React, { FC } from 'react';
import { m, Styles, ViewStyleProps } from 'styles';

interface Props extends ViewStyleProps {
  onClick?: () => void;
}

export const PlaceSearchCloseBtn: FC<Props> = ({ style, onClick }) => (
  <IconButton style={m(styles.container, style)} onClick={onClick}>
    <IconClose style={styles.closeBtnIcon} />
  </IconButton>
);

const styles: Styles = {
  container: {
    width: 20,
    height: 20,
  },
  icon: {
    width: 16,
    height: 16,
  },
};

export default PlaceSearchCloseBtn;

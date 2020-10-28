import { Text, View } from 'components/Common';
import { EquipmentMachine } from 'core/api';
import React, { FC } from 'react';
import { InfoWindow } from 'react-google-maps';
import { m, Styles, ViewStyleProps } from 'styles';

import photoBobcat from './assets/photo-bobcat.jpg';
import photoBorex from './assets/photo-borex.jpg';
import photoFoton504 from './assets/photo-foton-504.jpg';
import photoJcb from './assets/photo-jcb.jpg';
import photoKraz from './assets/photo-kraz.jpg';
import photoMaz from './assets/photo-maz.jpg';
import photoUmz6 from './assets/photo-umz-6.jpg';

interface Props extends ViewStyleProps {
  item: EquipmentMachine;
  onClose: () => void;
}

const itemToPhoto = (item: EquipmentMachine) => {
  if (!item.name) {
    return undefined;
  }
  const name = item.name.toLowerCase();
  if (name.indexOf('юмз-6') >= 0) {
    return photoUmz6;
  }
  if (name.indexOf('foton-504') >= 0) {
    return photoFoton504;
  }
  if (name.indexOf('краз') >= 0) {
    return photoKraz;
  }
  if (name.indexOf('борекс') >= 0) {
    return photoBorex;
  }
  if (name.indexOf('маз') >= 0) {
    return photoMaz;
  }
  if (name.indexOf('jcb') >= 0) {
    return photoJcb;
  }
  if (name.indexOf('bobcat') >= 0) {
    return photoBobcat;
  }
  return undefined;
};

export const EquipmentPopup: FC<Props> = ({ style, item, onClose }) => {
  const { speed, company } = item;
  const title = `${item.name}`;
  const photo = itemToPhoto(item);
  return (
    <InfoWindow onCloseClick={onClose}>
      <View style={m(styles.container, style)}>
        <View row={true} justifyContent="flex-start" alignItems="center">
          <View style={styles.title}>{title}</View>
        </View>
        {!!company && (
          <View style={[styles.indent]}>
            <Text bold={true}>{`Підприємство:`}</Text>
            <Text block={true}>{company}</Text>
          </View>
        )}
        <View style={[styles.indent]} row={true}>
          <Text bold={true}>{`Швидкість:`}</Text>
          <Text style={styles.val}>{`${speed ? speed : 0} км/год`}</Text>
        </View>
        {!!photo && (
          <View style={[styles.photoWrap, styles.indent]}>
            <img style={styles.photo} src={photo} />
          </View>
        )}
      </View>
    </InfoWindow>
  );
};

const styles: Styles = {
  container: {
    width: 140,
  },
  title: {
    fontWeight: 'bold',
  },
  val: {
    marginLeft: 6,
  },
  indent: {
    marginTop: 10,
  },
  photoWrap: {
    marginTop: 10,
    textAlign: 'center',
  },
  photo: {
    maxWidth: '200px',
    maxHeight: '100px',
  },
};

export default EquipmentPopup;

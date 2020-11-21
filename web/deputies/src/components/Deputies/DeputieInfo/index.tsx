import IconAddress from '@material-ui/icons/Business';
import IconCalendar from '@material-ui/icons/Event';
import IconPhone from '@material-ui/icons/PhoneIphone';
import { View } from 'components/Common';
import { Deputy } from 'core';
import React, { FC } from 'react';
import { px, Styles, ViewStyleProps } from 'styles';
import { capitalizeFirstLetter } from 'utils';

import PhotoSlider from './components/PhotoSlider';

interface Props extends ViewStyleProps {
  item: Deputy;
}

export const DeputieInfo: FC<Props> = ({ item, style }) => {
  const { name, photos, phones, schedule, address } = item;
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
};

const styles: Styles = {
  container: {},
  photosWrap: {
    marginRight: 12,
    textAlign: 'center',
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
    fontWeight: 'bold',
    fontSize: px(18),
  },
};

export default DeputieInfo;

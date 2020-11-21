import { AlertDialog } from 'components/Dialogs';
import { Deputy, DeputyDistrict, districtToVotersCount } from 'core';
import React, { FC } from 'react';
import { Styles } from 'styles';

import DeputieInfo from '../DeputieInfo';

interface Props {
  open?: boolean;
  item: DeputyDistrict;
  deputies: Deputy[];
  onClose?: () => void;
}

export const DistrictDialog: FC<Props> = ({ onClose, open, item, deputies }) => {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const votersCount = districtToVotersCount(item);
  const title = `Виборчий округ №${item.number} (${votersCount} чоловік)`;

  return (
    <AlertDialog title={title} visible={open} onClose={handleClose}>
      {deputies.map((deputie, index) => (
        <DeputieInfo key={index} style={index > 0 ? styles.itemBorder : undefined} item={deputie} />
      ))}
    </AlertDialog>
  );
};

const styles: Styles = {
  itemBorder: {
    marginTop: 20,
    borderTop: '1px dashed rgba(0, 0, 0, .4)',
  },
  content: {
    paddingBottom: 20,
  },
};

export default DistrictDialog;

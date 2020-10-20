import { Dialog, DialogContent } from '@material-ui/core';
import { ClosableDialogTitle } from 'components/Dialogs';
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
  const handleCloseAction = () => {
    if (onClose) {
      onClose();
    }
  };

  const votersCount = districtToVotersCount(item);
  const title = `Виборчий округ №${item.number} (${votersCount} чоловік)`;

  return (
    <Dialog open={open ? open : false} onClose={handleCloseAction}>
      <ClosableDialogTitle onClose={handleCloseAction}>{title}</ClosableDialogTitle>
      <DialogContent style={styles.content}>
        {deputies.map((deputie, index) => (
          <DeputieInfo key={index} style={index > 0 ? styles.itemBorder : undefined} item={deputie} />
        ))}
      </DialogContent>
    </Dialog>
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

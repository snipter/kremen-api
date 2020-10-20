import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import { ClosableDialogTitle } from "components/Dialogs";
import { districtToVotersCount, IDeputy, IDistrict } from "core";
import React, { FC } from "react";
import { DeputieInfo } from "scenes/Deputies";
import { IStyles } from "styles";

interface Props {
  open?: boolean;
  item: IDistrict;
  deputies: IDeputy[];
  onClose?: () => void;
}

export const DistrictDialog: FC<Props> = ({
  onClose,
  open,
  item,
  deputies,
}) => {
  const onCloseAction = () => {
    if (onClose) {
      onClose();
    }
  };

  const votersCount = districtToVotersCount(item);
  const title = `Виборчий округ №${item.number} (${votersCount} чоловік)`;

  return (
    <Dialog open={open ? open : false} onClose={onCloseAction}>
      <ClosableDialogTitle onClose={onCloseAction}>{title}</ClosableDialogTitle>
      <DialogContent style={styles.content}>
        {deputies.map((deputie, index) => (
          <DeputieInfo
            key={index}
            style={index > 0 ? styles.itemBorder : undefined}
            item={deputie}
          />
        ))}
      </DialogContent>
    </Dialog>
  );
};

const styles: IStyles = {
  itemBorder: {
    marginTop: 20,
    borderTop: "1px dashed rgba(0, 0, 0, .4)",
  },
  content: {
    paddingBottom: 20,
  },
};

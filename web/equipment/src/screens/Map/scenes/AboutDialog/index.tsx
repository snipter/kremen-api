import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import React, { FC } from 'react';
import { ViewStyleProps } from 'styles';

interface Props extends ViewStyleProps {
  open: boolean;
  onClose: () => void;
}

export const AboutDialog: FC<Props> = ({ open, onClose }) => (
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle>{'Про додаток'}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        <p>
          Додаток створений на основі відкритих даних взятих з офіційного сайту{' '}
          <a target="__blank" href="https://www.kremen.gov.ua/index.php?view=info-bus">
            Кременчуцької міської ради
          </a>
          .
        </p>
        <p>Проект розробляється на волонтерських засадах і не має на меті заробляти гроші.</p>
        <p>З питаннями, пропозиціями та інформацією про помилки звертатись:</p>
        <p>
          <a target="__blank" href="https://fb.me/snipter">
            https://fb.me/snipter
          </a>
        </p>
        <p>
          <a target="__blank" href="mailto:websnitper@gmail.com">
            websnitper@gmail.com
          </a>
        </p>
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary" autoFocus={true}>
        Закрити
      </Button>
    </DialogActions>
  </Dialog>
);

export default AboutDialog;

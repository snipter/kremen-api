import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import React, { FC } from 'react';
import { ViewStyleProps } from 'styles';
import ReactMarkdown from 'react-markdown';
import content from './content.md';

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
        <ReactMarkdown source={content} />
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

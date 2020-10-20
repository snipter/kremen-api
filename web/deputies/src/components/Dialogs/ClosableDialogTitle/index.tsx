import MuiDialogTitle, {
  DialogTitleProps,
} from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import React, { FC } from "react";

interface IBaseProps extends DialogTitleProps {
  onClose?: () => void;
}

type Props = WithStyles<typeof styles> & IBaseProps;

const ClosableDialogTitle: FC<Props> = (props) => {
  const { classes, onClose, children } = props;
  return (
    <MuiDialogTitle disableTypography={true} className={classes.container}>
      <Typography variant="h6">{children}</Typography>
      {onClose && (
        <IconButton
          aria-label="close"
          className={classes.btn}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      )}
    </MuiDialogTitle>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      margin: 0,
      padding: theme.spacing(2),
    },
    btn: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export default withStyles(styles)(ClosableDialogTitle);

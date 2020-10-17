import red from '@material-ui/core/colors/red';
import { createMuiTheme } from '@material-ui/core/styles';

export const muiTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: red,
  },
});

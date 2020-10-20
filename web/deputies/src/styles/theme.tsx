import { createMuiTheme } from '@material-ui/core/styles';
import { colors } from './colors';

export const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: colors.blue,
    },
    text: {
      primary: '#000000',
    },
  },
});

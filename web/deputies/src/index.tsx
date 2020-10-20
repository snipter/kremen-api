import './index.css';

import { ThemeProvider } from '@material-ui/styles';
import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { Navigation } from 'screens';
import { muiTheme } from 'styles';

const App: FC = () => (
  <ThemeProvider theme={muiTheme}>
    <Navigation />
  </ThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('app'));

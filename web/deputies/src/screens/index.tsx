import React, { FC } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import MapScreen from './Map';
import RightsScreen from './Rights';
import { NavPaths } from './types';

export const Navigation: FC = () => (
  <Router>
    <Switch>
      <Route path={NavPaths.Rights} component={RightsScreen} />
      <Route path={NavPaths.Map} component={MapScreen} />
      <Redirect to={NavPaths.Map} />
    </Switch>
  </Router>
);

export default Navigation;

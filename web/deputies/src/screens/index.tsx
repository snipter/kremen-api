import React, { FC } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import AboutScreen from './About';
import MapScreen from './Map';
import RightsScreen from './Rights';
import { NavPaths } from './types';

export const Navigation: FC = () => (
  <Router>
    <Switch>
      <Route path={NavPaths.Rights} component={RightsScreen} />
      <Route path={NavPaths.About} component={AboutScreen} />
      <Route path={NavPaths.Map} component={MapScreen} />
      <Redirect to={NavPaths.Map} />
    </Switch>
  </Router>
);

export default Navigation;

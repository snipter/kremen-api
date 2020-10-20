import React, { FC } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import AboutScreen from 'screens/About';
import DistrictsMapScreen from 'screens/DistrictsMap';
import RightsScreen from 'screens/Rights';
import { NavPaths } from './types';

const Navigation: FC = () => {
  return (
    <Router>
      <Switch>
        <Route path={NavPaths.Rights} component={RightsScreen} />
        <Route path={NavPaths.About} component={AboutScreen} />
        <Route path={NavPaths.Map} component={DistrictsMapScreen} />
        <Redirect to={NavPaths.Map}/>
      </Switch>
    </Router>
  );
};

export default Navigation;

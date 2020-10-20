import ContentPage from 'components/ContentPage';
import { track } from 'core';
import React, { FC, useEffect } from 'react';
import AppInfo from 'scenes/AppInfo';

const AboutScreen: FC = () => {
  useEffect(() => track('AboutScreenVisit'), []);
  return (
    <ContentPage>
      <h1>Про додаток</h1>
      <AppInfo />
      <p>
        <a href="/">Повернутись до карти</a>
      </p>
    </ContentPage>
  );
};

export default AboutScreen;

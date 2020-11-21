import { Paper } from '@material-ui/core';
import { DocTitle, Markdown } from 'components/Common';
import React, { FC } from 'react';
import { Styles } from 'styles';

import privacyContent from 'content/privacy.md';

export const PrivacyScreen: FC = () => (
  <Paper style={styles.content}>
    <DocTitle title="Політика конфіденційності" />
    <Markdown>{privacyContent}</Markdown>
  </Paper>
);

const styles: Styles = {
  container: {},
  content: {
    maxWidth: 992,
    margin: '40px auto',
    padding: '20px',
  },
};

export default PrivacyScreen;

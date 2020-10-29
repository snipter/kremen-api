import { Paper } from '@material-ui/core';
import { Markdown } from 'components/Common';
import React, { FC } from 'react';
import { connect } from 'react-redux';
import { Styles } from 'styles';

import content from './content.md';

export const PrivacyScreen: FC = () => (
  <Paper style={styles.content}>
    <Markdown>{connect}</Markdown>
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

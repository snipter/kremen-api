import { Paper } from '@material-ui/core';
import React, { FC } from 'react';
import { Styles } from 'styles';

import content from './content.md';

export const PrivacyScreen: FC = () => <Paper style={styles.content}>{content}</Paper>;

const styles: Styles = {
  container: {},
  content: {
    maxWidth: 992,
    margin: '40px auto',
    padding: '20px',
  },
};

export default PrivacyScreen;

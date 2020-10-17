import React, { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import content from './content.md';
import { Paper } from '@material-ui/core';
import { Styles } from '@kremen/react';

export const PrivacyScreen: FC = () => (
  <Paper style={styles.content}>
    <ReactMarkdown source={content} />
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

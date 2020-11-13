import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import React, { FC, useState } from 'react';
import HelpIcon from '@material-ui/icons/HelpOutline';
import { colors, Styles } from 'styles';
import { track } from 'mixpanel-browser';
import { AlertDialog } from 'components/Dialogs';
import { Markdown } from 'components/Common';

import body from './content/body.md';
import footer from './content/footer.md';
import { ServiceIcon } from 'components/Branding';

export const LayoutAppBar: FC = () => {
  const [aboutVisible, setAboutVisible] = useState<boolean>(false);

  const handleAboutPress = () => {
    track('AboutBtnPress');
    setAboutVisible(true);
  };

  return (
    <>
      <AppBar position="static" style={styles.container}>
        <Toolbar style={styles.toolbar}>
          <ServiceIcon style={styles.icon} type="transport" size={24} color={colors.white} />
          <Typography variant="h6" style={styles.title}>{`#Кремінь.Транспорт`}</Typography>
          <IconButton color="inherit" onClick={handleAboutPress}>
            <HelpIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <AlertDialog title="Про додаток" visible={aboutVisible} onClose={() => setAboutVisible(false)}>
        <Markdown>{body}</Markdown>
        <Markdown>{footer}</Markdown>
      </AlertDialog>
    </>
  );
};

const styles: Styles = {
  container: {
    backgroundColor: colors.withAlpha(colors.primary, 0.7),
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  toolbar: { minHeight: 54 },
  title: { flexGrow: 1 },
};

export default LayoutAppBar;

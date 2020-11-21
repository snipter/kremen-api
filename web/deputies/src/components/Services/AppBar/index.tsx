import { AppBar, IconButton, Toolbar } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/HelpOutline';
import { Markdown, View } from 'components/Common';
import { AlertDialog } from 'components/Dialogs';
import ServicesDropdown from 'components/Services/Dropdown';
import ServicesIcon from 'components/Services/Icon';
import { track } from 'mixpanel-browser';
import React, { FC, useState } from 'react';
import { colors, Styles, useTheme } from 'styles';

import body from './content/body.md';
import footer from './content/footer.md';

export const ServicesAppBar: FC = () => {
  const [aboutVisible, setAboutVisible] = useState<boolean>(false);

  const theme = useTheme();

  const handleAboutPress = () => {
    track('AboutBtnPress');
    setAboutVisible(true);
  };

  return (
    <>
      <AppBar position="static" style={styles.container}>
        <Toolbar style={styles.toolbar}>
          <ServicesIcon style={styles.icon} name={APP_NAME || ''} size={24} color={theme.palette.text.primary} />
          <View style={styles.titleWrap} row={true} alignItems="center">
            <ServicesDropdown current={APP_NAME || ''} />
          </View>
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
    backgroundColor: colors.withAlpha(colors.primary, 0.8),
  },
  toolbar: { minHeight: 54 },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  titleWrap: {
    flexGrow: 1,
  },
};

export default ServicesAppBar;

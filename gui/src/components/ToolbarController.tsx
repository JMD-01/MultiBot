import { AppBar, Theme, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { useTheme } from '@mui/material/styles';

let appBarStyle =(theme: Theme) => {
  return {
    height: '64px',
    backgroundColor: '#233044',
    zIndex: theme.zIndex.drawer +1,
  }
};

export default function ToolbarController() {
  const theme = useTheme();

    return (
      <AppBar position="fixed" sx={appBarStyle(theme)}>
        <Toolbar>
          <Typography variant="h6" color="inherit">
            MultiBot 2.0.3 BETA
          </Typography>
        </Toolbar>
      </AppBar>
    );
}

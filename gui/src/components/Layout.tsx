import React from 'react';
import { Box, Theme, Toolbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ToolbarController from './ToolbarController';
import Sidebar from './Sidebar';


export interface LayoutProps {
  children: React.ReactNode;
}

let rootStyle = (theme: Theme) => {
  return {
    display: 'flex',
    backgroundColor: theme.palette.background.default
  }
};

let boxStyle = {
  width: "788px",
  height: "605px",
  maxWidth: "818px",
  maxHeight:"605px",
  overflow: 'auto',
  padding: "15px"
};

let appBarStyle = (theme: Theme) => {
  return {
    zIndex: theme.zIndex.drawer + 1
  }
};
export default function Layout({children}: LayoutProps) {
  const theme = useTheme();

  return (
    <div style={rootStyle(theme)}>
      {/* Toolbar  */}
      <ToolbarController/>
      {/* Sidebar */}
      <Sidebar/>
      {/* Content */}
      <div>
        <Toolbar />
        <Box sx={boxStyle}>
          { children }
        </Box>
      </div>
    </div>
  )
}

import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#56606F',
    },
    secondary: {
      main: '#4782DA',
    },
    background: {
      default: '#303030',
      paper: '#424242',
    },
  },
});

export default theme;

import { render } from 'react-dom';
import './index.css';
import App from './App';
import * as React from 'react';
import { ThemeProvider } from '@mui/material';
import theme from './theme';

render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


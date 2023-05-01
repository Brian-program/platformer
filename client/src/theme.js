import { createTheme } from '@mui/material/styles';

// create theme for website
const theme = createTheme({
  // set colors to use
  palette: {
    primary: {
      main: '#365f3d',
    },
    secondary: {
      main: '#cfebc0',
    },
    tertiary: {
      main: '#f2bac9',
    },
  }
});

export default theme;

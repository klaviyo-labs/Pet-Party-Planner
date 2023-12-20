import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#011a06',
    },
    secondary: {
      main: '#3A3B3C',
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  spacing: 8
});

export default theme;
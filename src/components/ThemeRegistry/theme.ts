import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});
const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
          main: '#3f51b5',
        },
        secondary: {
          main: '#f50057',
        },
        background: {
          default: '#fff',
          paper: '#f2f2f2',
        },
      },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.severity === 'info' && {
            backgroundColor: '#60a5fa',
          }),
        }),
      },
    },
  },
});
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
          main: '#3f51b5',
        },
        secondary: {
          main: '#f50057',
        },
        background: {
          default: '#2f2f2f',
          paper: '#000',
        },
      },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.severity === 'info' && {
            backgroundColor: '#60a5fa',
          }),
        }),
      },
    },
  },
});

export {lightTheme, darkTheme};
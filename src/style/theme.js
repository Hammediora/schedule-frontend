import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary: {
        main: '#451400',
      },
      background: {
        default: '#FFFAF0',
      },
      text: {
        primary: '#451400',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      allVariants: {
        color: '#451400',
      },
      button: {
        fontSize: '1rem',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            backgroundColor: '#451400',
            color: '#FFFAF0',
            '&:hover': {
              backgroundColor: '#A24E3F',  
            },
          },
        },
      },
    },
  });
  
export default theme;

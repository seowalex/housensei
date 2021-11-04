import { forwardRef, useMemo, useEffect } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import ReactGA from 'react-ga';
import initHelpHero from 'helphero';
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from '@mui/material';
import { SnackbarProvider } from 'notistack';

import { Timeline as TimelineIcon } from '@mui/icons-material';
import { useAppSelector } from './app/hooks';
import { selectDarkMode } from './reducers/settings';

import Routes from './Routes';

import './styles/main.scss';

const LinkBehavior = forwardRef<
  never,
  Omit<LinkProps, 'to'> & { href: LinkProps['to'] }
>(({ href, ...other }, ref) => <Link ref={ref} to={href} {...other} />);

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const darkMode = useAppSelector(selectDarkMode) ?? prefersDarkMode;
  const GA_TRACKING_ID = 'UA-210777320-1';

  useEffect(() => {
    ReactGA.initialize(GA_TRACKING_ID, {
      debug: !import.meta.env.PROD,
    });
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
        components: {
          MuiButtonBase: {
            defaultProps: {
              LinkComponent: LinkBehavior,
            },
          },
          MuiLink: {
            defaultProps: {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              component: LinkBehavior,
            },
          },
          MuiListSubheader: {
            styleOverrides: {
              root: {
                backgroundColor: 'inherit',
              },
            },
          },
        },
      }),
    [darkMode]
  );
  const hlp = initHelpHero('Uw9RsnlVLn');
  hlp.anonymous();

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={1}
          iconVariant={{ success: <TimelineIcon fontSize="small" /> }}
        >
          <Routes />
        </SnackbarProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;

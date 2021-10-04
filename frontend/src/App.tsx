import { forwardRef, useMemo } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from '@mui/material';

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

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;

import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from '@mui/material';

import { useAppSelector } from './app/hooks';
import { selectPrefersDarkMode } from './reducers/settings';

import Routes from './Routes';

import './styles/main.scss';

const LinkBehavior = React.forwardRef<
  never,
  Omit<LinkProps, 'to'> & { href: LinkProps['to'] }
>(({ href, ...other }, ref) => <Link ref={ref} to={href} {...other} />);

const App = () => {
  const systemPrefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersDarkMode =
    useAppSelector(selectPrefersDarkMode) ?? systemPrefersDarkMode;

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
        components: {
          MuiLink: {
            defaultProps: {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              component: LinkBehavior,
            },
          },
          MuiButtonBase: {
            defaultProps: {
              LinkComponent: LinkBehavior,
            },
          },
        },
      }),
    [prefersDarkMode]
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

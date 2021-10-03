import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from '@mui/material';

import Routes from './Routes';

import './styles/main.scss';

const LinkBehavior = React.forwardRef<
  never,
  Omit<LinkProps, 'to'> & { href: LinkProps['to'] }
>(({ href, ...other }, ref) => <Link ref={ref} to={href} {...other} />);

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

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

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {
  AppBar,
  Button,
  IconButton,
  Link,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

import { useAppDispatch, useAppSelector } from './app/hooks';
import { selectPrefersDarkMode, setPrefersDarkMode } from './reducers/settings';

const Routes = () => {
  const dispatch = useAppDispatch();
  const systemPrefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersDarkMode =
    useAppSelector(selectPrefersDarkMode) ?? systemPrefersDarkMode;

  const handleTogglePrefersDarkMode = () =>
    dispatch(setPrefersDarkMode(!prefersDarkMode));

  return (
    <Router>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton size="large" edge="start" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Housensei
          </Typography>
          <IconButton size="large" onClick={handleTogglePrefersDarkMode}>
            {prefersDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/users">Users</Link>
          </li>
        </ul>
      </nav>

      <Switch>
        <Route path="/about">
          <Button variant="contained">About</Button>
        </Route>
        <Route path="/users">
          <Button variant="contained">Users</Button>
        </Route>
        <Route path="/">
          <Button variant="contained">Hello World</Button>
        </Route>
      </Switch>
    </Router>
  );
};

export default Routes;

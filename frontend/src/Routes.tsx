import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {
  AppBar,
  Button,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

const Routes = () => (
  <Router>
    <AppBar position="sticky">
      <Toolbar>
        <IconButton size="large" edge="start" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Housensei
        </Typography>
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

export default Routes;

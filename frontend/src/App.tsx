import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Button, Link } from '@mui/material';

const App = () => (
  <Router>
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

export default App;

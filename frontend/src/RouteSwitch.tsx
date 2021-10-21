import { useEffect } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { ga } from 'react-ga';
import Heatmap from './pages/Heatmap';
import History from './pages/History';
import NotFound from './pages/NotFound';
import Grants from './pages/Grants';

const RouteSwitch = () => {
  const trackPageView = () => {
    ga('set', 'page', window.location.pathname);
    ga('send', 'pageview');
  };

  const history = useHistory();

  useEffect(() => {
    trackPageView();
    history.listen(trackPageView);
  });

  return (
    <Switch>
      <Redirect exact from="/" to="/heatmap" />
      <Route path="/heatmap">
        <Heatmap />
      </Route>
      <Route path="/history">
        <History />
      </Route>
      <Route path="/grants">
        <Grants />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
};

export default RouteSwitch;

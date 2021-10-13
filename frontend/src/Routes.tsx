import { useState } from 'react';
import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import {
  AppBar,
  Box,
  CSSObject,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Theme,
  Toolbar,
  Tooltip,
  Typography,
  styled,
  useMediaQuery,
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Map as MapIcon,
  Menu as MenuIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';

import { useAppDispatch, useAppSelector } from './app/hooks';
import Heatmap from './pages/Heatmap';
import History from './pages/History';
import NotFound from './pages/NotFound';
import { selectDarkMode, setDarkMode } from './reducers/settings';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  overflowX: 'hidden',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
});

const closedMixin = (theme: Theme): CSSObject => ({
  width: `calc(${theme.spacing(7)} + 1px)`,
  overflowX: 'hidden',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
});

const MiniDrawer = styled(Drawer)(({ theme, open }) => ({
  whiteSpace: 'nowrap',
  ...(open && {
    ...openedMixin(theme),
    '.MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '.MuiDrawer-paper': closedMixin(theme),
  }),
}));

const Routes = () => {
  const dispatch = useAppDispatch();
  const isDesktop = useMediaQuery('(min-width: 600px)');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const darkMode = useAppSelector(selectDarkMode) ?? prefersDarkMode;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const drawer = (
    <List>
      <Tooltip
        title="Price Heatmap"
        placement="right"
        disableHoverListener={drawerOpen || !isDesktop}
      >
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/heatmap">
            <ListItemIcon>
              <MapIcon />
            </ListItemIcon>
            <ListItemText primary="Price Heatmap" />
          </ListItemButton>
        </ListItem>
      </Tooltip>

      <Tooltip
        title="Price History"
        placement="right"
        disableHoverListener={drawerOpen || !isDesktop}
      >
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/history">
            <ListItemIcon>
              <TimelineIcon />
            </ListItemIcon>
            <ListItemText primary="Price History" />
          </ListItemButton>
        </ListItem>
      </Tooltip>

      <Tooltip
        title="Grant Calculator"
        placement="right"
        disableHoverListener={drawerOpen || !isDesktop}
      >
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/grants">
            <ListItemIcon>
              <CalculateIcon />
            </ListItemIcon>
            <ListItemText primary="Grant Calculator" />
          </ListItemButton>
        </ListItem>
      </Tooltip>
    </List>
  );

  return (
    <Router>
      <AppBar
        position="sticky"
        sx={{
          zIndex: (theme) => ({ sm: theme.zIndex.drawer + 1 }),
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Housensei
          </Typography>
          <Tooltip title="Toggle dark mode" placement="bottom-start">
            <IconButton
              size={isDesktop ? 'large' : 'medium'}
              onClick={() => dispatch(setDarkMode(!darkMode))}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex' }}>
        <MiniDrawer
          variant="permanent"
          open={drawerOpen}
          sx={{
            display: { xs: 'none', sm: 'block' },
          }}
        >
          <Toolbar />
          {drawer}
        </MiniDrawer>
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(!drawerOpen)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '.MuiDrawer-paper': {
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        <Switch>
          <Redirect exact from="/" to="/heatmap" />
          <Route path="/heatmap">
            <Heatmap />
          </Route>
          <Route path="/history">
            <History />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Box>
    </Router>
  );
};

export default Routes;

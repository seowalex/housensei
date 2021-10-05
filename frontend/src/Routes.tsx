import { useState } from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import {
  AppBar,
  Box,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  Calculate as CalculateIcon,
  DarkMode as DarkModeIcon,
  Home as HomeIcon,
  LightMode as LightModeIcon,
  Map as MapIcon,
  Menu as MenuIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';

import { useAppDispatch, useAppSelector } from './app/hooks';
import { selectDarkMode, setDarkMode } from './reducers/settings';

import Heatmap from './pages/Heatmap';
import NotFound from './pages/NotFound';

const drawerWidth = 240;

const Routes = () => {
  const dispatch = useAppDispatch();
  const isDesktop = useMediaQuery('(min-width: 600px)');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const darkMode = useAppSelector(selectDarkMode) ?? prefersDarkMode;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
  const handleDarkModeToggle = () => dispatch(setDarkMode(!darkMode));

  const drawer = (
    <>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />

      <List subheader={<ListSubheader>HDB Property Prices</ListSubheader>}>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/history">
            <ListItemIcon>
              <TimelineIcon />
            </ListItemIcon>
            <ListItemText primary="History" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/heatmap">
            <ListItemIcon>
              <MapIcon />
            </ListItemIcon>
            <ListItemText primary="Heatmap" />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />

      <List subheader={<ListSubheader>HDB Property Financing</ListSubheader>}>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <CalculateIcon />
            </ListItemIcon>
            <ListItemText primary="Grant Calculator" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <AccountBalanceIcon />
            </ListItemIcon>
            <ListItemText primary="Loan Comparison" />
          </ListItemButton>
        </ListItem>
      </List>
    </>
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
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Housensei
          </Typography>
          <Tooltip title="Toggle dark mode" placement="bottom-start">
            <IconButton
              size={isDesktop ? 'large' : 'medium'}
              onClick={handleDarkModeToggle}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex' }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            display: { xs: 'none', sm: 'block' },
            '.MuiDrawer-paper': {
              width: drawerWidth,
            },
          }}
        >
          <Toolbar />
          {drawer}
        </Drawer>
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerToggle}
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
          <Route exact path="/">
            <Container sx={{ p: 3 }}>
              <Typography paragraph>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Rhoncus dolor purus non enim praesent elementum facilisis leo
                vel. Risus at ultrices mi tempus imperdiet. Semper risus in
                hendrerit gravida rutrum quisque non tellus. Convallis convallis
                tellus id interdum velit laoreet id donec ultrices. Odio morbi
                quis commodo odio aenean sed adipiscing. Amet nisl suscipit
                adipiscing bibendum est ultricies integer quis. Cursus euismod
                quis viverra nibh cras. Metus vulputate eu scelerisque felis
                imperdiet proin fermentum leo. Mauris commodo quis imperdiet
                massa tincidunt. Cras tincidunt lobortis feugiat vivamus at
                augue. At augue eget arcu dictum varius duis at consectetur
                lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
                sapien faucibus et molestie ac.
              </Typography>
            </Container>
          </Route>
          <Route path="/history">
            <Container sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom>
                HDB Property Price History
              </Typography>
              <Typography paragraph>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Rhoncus dolor purus non enim praesent elementum facilisis leo
                vel. Risus at ultrices mi tempus imperdiet. Semper risus in
                hendrerit gravida rutrum quisque non tellus. Convallis convallis
                tellus id interdum velit laoreet id donec ultrices. Odio morbi
                quis commodo odio aenean sed adipiscing. Amet nisl suscipit
                adipiscing bibendum est ultricies integer quis. Cursus euismod
                quis viverra nibh cras. Metus vulputate eu scelerisque felis
                imperdiet proin fermentum leo. Mauris commodo quis imperdiet
                massa tincidunt. Cras tincidunt lobortis feugiat vivamus at
                augue. At augue eget arcu dictum varius duis at consectetur
                lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
                sapien faucibus et molestie ac.
              </Typography>
            </Container>
          </Route>
          <Route path="/heatmap">
            <Heatmap />
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

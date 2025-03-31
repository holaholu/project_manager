import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assignment as ProjectIcon,
  Task as TaskIcon,
  Group as TeamIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  BusinessCenter as AppIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { Footer } from './Footer';

const drawerWidth = 240;

// No props needed since we're using Outlet
type MainLayoutProps = {}

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/app/dashboard', color: '#3f51b5' },
  { text: 'Projects', icon: <ProjectIcon />, path: '/app/projects', color: '#009688' },
  { text: 'Tasks', icon: <TaskIcon />, path: '/app/tasks', color: '#ff5722' },
  { text: 'Team', icon: <TeamIcon />, path: '/app/team', color: '#8e24aa' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/app/settings', color: '#455a64' },
];

export const MainLayout: React.FC<MainLayoutProps> = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const getCurrentPageColor = () => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find(item => item.path === currentPath);
    return currentItem?.color || '#2196f3';
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box>
      <Toolbar sx={{ py: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', pl: 1 }}>
          <AppIcon sx={{ 
            fontSize: '1.5rem', 
            color: '#2196f3',
            filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.2))'
          }} />
          <Typography 
            variant="subtitle1" 
            noWrap 
            component="div"
            sx={{ 
              fontWeight: 600,
              background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0px 1px 1px rgba(0,0,0,0.1)',
              letterSpacing: '0.3px',
              fontSize: '1rem'
            }}
          >
            Project Manager
          </Typography>
        </Box>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link as any}
            to={item.path}
            sx={{
              backgroundColor: location.pathname === item.path ? item.color + '20' : 'transparent',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: item.color + '10',
              },
              borderLeft: `4px solid ${location.pathname === item.path ? item.color : 'transparent'}`,
              transition: 'all 0.2s',
            }}
          >
            <ListItemIcon
              sx={{
                color: item.color,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                color: item.color,
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find((item) => item.path === location.pathname)?.text || 'Project Manager'}
          </Typography>
          <Button
            color="inherit"
            onClick={() => navigate('/app/settings')}
            sx={{ mr: 2 }}
          >
            {user?.name || 'Account Settings'}
          </Button>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Box sx={{ flex: 1, p: 3 }}>
          <Outlet />
        </Box>
        <Box sx={{ 
          width: '100vw', 
          ml: { sm: `-${drawerWidth}px` },
          position: 'relative',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}>
          <Footer color={getCurrentPageColor()} />
        </Box>
      </Box>
    </Box>
  );
};

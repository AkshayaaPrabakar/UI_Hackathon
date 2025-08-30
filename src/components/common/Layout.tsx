import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Assignment,
  People,
  Notifications,
  AccountCircle,
  Settings,
  ExitToApp,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useCustomTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);

  const menuItems = user?.role === 'admin' 
    ? [
        { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
        { text: 'Employees', icon: <People />, path: '/admin/employees' },
        { text: 'Reports', icon: <Assignment />, path: '/admin/reports' },
      ]
    : [
        { text: 'Dashboard', icon: <Dashboard />, path: '/employee' },
        { text: 'Questionnaire', icon: <Assignment />, path: '/employee/questionnaire' },
        { text: 'Reports', icon: <Assignment />, path: '/employee/reports' },
      ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleProfileMenuClose();
  };

  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` },
          ml: { md: `${drawerOpen ? drawerWidth : 0}px` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Employee Tracking System
          </Typography>

          <Tooltip title="Toggle theme">
            <IconButton onClick={toggleTheme} color="inherit">
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton color="inherit">
              <Badge badgeContent={2} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Profile">
            <IconButton onClick={handleProfileMenuOpen} color="inherit">
              <Avatar
                src={user?.avatar}
                alt={user?.name}
                sx={{ width: 32, height: 32 }}
              >
                {user?.name?.[0]}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={profileMenuAnchor}
            open={Boolean(profileMenuAnchor)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleProfileMenuClose}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <ExitToApp fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 1 }}>
          <List>
            {menuItems.map((item) => (
              <motion.div
                key={item.text}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ListItem
                  button
                  selected={location.pathname === item.path}
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) setDrawerOpen(false);
                  }}
                  sx={{
                    mx: 1,
                    borderRadius: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              </motion.div>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </Box>
    </Box>
  );
};

export default Layout;
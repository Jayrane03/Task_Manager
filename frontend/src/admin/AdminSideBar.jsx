// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Toolbar,
  Box,
  Divider,
  Typography,
  Avatar,
  Stack,
  CircularProgress,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import TaskBoard from '../components/taskBoard';
import { fetchUserData } from '../Services/userService'; // Import the service function

const drawerWidth = 270;

const NotificationsComponent = () => <h2 style={{ color: '#151A2D' }}>Notifications</h2>;
const TeamsComponent = () => <h2 style={{ color: '#151A2D' }}>Team Management</h2>;
const SettingsComponent = () => <h2 style={{ color: '#151A2D' }}>Settings</h2>;
const MyTasksComponent = () => <h2 style={{ color: '#151A2D' }}>My Tasks</h2>;

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      setIsLoadingUser(true);
      const user = await fetchUserData(); // Call the service function
      setLoggedInUser(user);
      setIsLoadingUser(false);
    };
    getUser();
  }, []);

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = "/login";
  };

  const userInitial = loggedInUser?.name?.[0]?.toUpperCase() || 'U';

  const drawerContent = (
    <Box
      sx={{
        width: drawerWidth,
        height: '100%',
        backgroundColor: '#151A2D',
        color: '#b195fb',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Box>
        {/* Logo + App Name */}
        <Toolbar sx={{ px: 2, py: 3, justifyContent: 'center' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ bgcolor: '#b195fb' }}>🗂️</Avatar>
            <Typography variant="h6" sx={{ color: '#b195fb' }}>
              TaskFlow
            </Typography>
          </Stack>
        </Toolbar>

        <Divider sx={{ borderColor: '#b195fb' }} />

        {/* Nav Items */}
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setActiveTab("dashboard")}>
              <ListItemIcon sx={{ color: '#b195fb' }}><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => setActiveTab("mytasks")}>
              <ListItemIcon sx={{ color: '#b195fb' }}><AssignmentIcon /></ListItemIcon>
              <ListItemText primary="My Tasks" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => setActiveTab("teams")}>
              <ListItemIcon sx={{ color: '#b195fb' }}><GroupIcon /></ListItemIcon>
              <ListItemText primary="Teams" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => setActiveTab("notifications")}>
              <ListItemIcon sx={{ color: '#b195fb' }}><NotificationsIcon /></ListItemIcon>
              <ListItemText primary="Notifications" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => setActiveTab("settings")}>
              <ListItemIcon sx={{ color: '#b195fb' }}><AdminPanelSettingsIcon /></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Bottom: Avatar + Logout */}
      <Box>
        <Divider sx={{ borderColor: '#b195fb' }} />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon sx={{ color: '#FF6666' }}><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Sign Out" sx={{ color: '#FF6666' }} />
            </ListItemButton>
          </ListItem>
        </List>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <Avatar sx={{ bgcolor: '#b195fb', color: '#151A2D', fontWeight: 'bold' }}>
            {userInitial}
          </Avatar>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Mobile Menu Button */}
      <Box sx={{ display: { xs: 'block', sm: 'none' }, p: 1 }}>
        <IconButton onClick={toggleDrawer} sx={{ color: '#151A2D' }}>
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Drawer for mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: '#151A2D',
            color: '#EEF2FF'
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Drawer for desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: '#151A2D',
            color: '#EEF2FF'
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Main Content - Conditionally render based on user data loading */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { sm: `${drawerWidth}px` } }}>
        {isLoadingUser ? (
            <CircularProgress></CircularProgress>
        ) : !loggedInUser ? (
          <Typography variant="h5" color="error">Failed to load user data. Please log in again.</Typography>
        ) : (
          <>
            {/* TaskBoard no longer needs userData prop, it fetches its own */}
            {activeTab === "dashboard" && <TaskBoard />} 
            {activeTab === "mytasks" && <MyTasksComponent />}
            {activeTab === "teams" && <TeamsComponent />}
            {activeTab === "notifications" && <NotificationsComponent />}
            {activeTab === "settings" && <SettingsComponent />}
          </>
        )}
      </Box>
    </Box>
  );
}
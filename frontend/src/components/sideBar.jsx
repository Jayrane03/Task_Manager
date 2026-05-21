// src/components/Sidebar.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
  Chip,
  Paper,
} from '@mui/material';
import Badge from '@mui/material/Badge';
import BadgeIcon from '@mui/icons-material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import TaskBoard from './taskBoard';
import { fetchUserData } from '../Services/userService'; // Import the service function
import Team from './Team';
import MyTask from './MyTask';
import AssignTask from '../admin/AssignTask';
import Employees from '../admin/Employees';
import Profile from './Profile';
const drawerWidth = 270;

const NotificationsComponent = ({ notifications }) => {
  const unreadCount = notifications?.filter((note) => !note.read).length || 0;
  const sortedNotifications = [...(notifications || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <Box sx={{ p: 3, borderRadius: 4, backgroundColor: '#12122e', minHeight: 'calc(100vh - 100px)' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" spacing={2} mb={3}>
        <Box>
          <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 700 }}>Notifications</Typography>
          <Typography variant="body2" sx={{ color: '#9fa2c1', mt: 1 }}>
            Latest assignment updates, status changes, and admin messages.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip label={`Total ${notifications?.length || 0}`} sx={{ bgcolor: '#1f1f3d', color: '#dcdcff', fontWeight: 600 }} />
          <Chip label={`Unread ${unreadCount}`} color="secondary" sx={{ fontWeight: 600 }} />
        </Stack>
      </Stack>

      {sortedNotifications.length > 0 ? (
        <Stack spacing={2}>
          {sortedNotifications.map((notification, index) => (
            <Paper
              key={index}
              elevation={1}
              sx={{
                p: 3,
                backgroundColor: '#1f1f3d',
                borderRadius: 3,
                border: '1px solid rgba(177,149,251,0.18)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" spacing={1}>
                <Typography variant="body1" sx={{ color: '#edf1ff', fontWeight: 600, flex: 1 }}>
                  {notification.message}
                </Typography>
                {!notification.read && <Chip label="NEW" color="secondary" size="small" />}
              </Stack>
              <Typography variant="caption" sx={{ color: '#8e8ead', mt: 1, display: 'block' }}>
                {new Date(notification.createdAt).toLocaleString()}
              </Typography>
            </Paper>
          ))}
        </Stack>
      ) : (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', backgroundColor: '#151a2d', border: '1px dashed rgba(255,255,255,0.08)' }}>
          <Typography variant="body1" color="#9fa2c1">
            No notifications yet. Task updates and team progress messages will appear here as soon as they arrive.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

NotificationsComponent.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.shape({
    message: PropTypes.string,
    createdAt: PropTypes.string,
  })),
};

// const TeamsComponent = () => <h2 style={{ color: '#151A2D' }}>Team Management</h2>;

// const TeamsComponent = <Team></Team>

export default function Sidebar() {
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
            <ListItemButton onClick={() => setActiveTab('dashboard')}>
              <ListItemIcon sx={{ color: '#b195fb' }}><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          {loggedInUser?.role === 'admin' ? (
            <ListItem disablePadding>
              <ListItemButton onClick={() => setActiveTab('assignTask')}>
                <ListItemIcon sx={{ color: '#b195fb' }}><AssignmentIcon /></ListItemIcon>
                <ListItemText primary="Task Board" />
              </ListItemButton>
            </ListItem>
          ) : (
            <ListItem disablePadding>
              <ListItemButton onClick={() => setActiveTab('mytasks')}>
                <ListItemIcon sx={{ color: '#b195fb' }}><AssignmentIcon /></ListItemIcon>
                <ListItemText primary="My Tasks" />
              </ListItemButton>
            </ListItem>
          )}

          {loggedInUser?.role === 'admin' && (
            <>
              <ListItem disablePadding>
                <ListItemButton onClick={() => setActiveTab('teams')}>
                  <ListItemIcon sx={{ color: '#b195fb' }}><GroupIcon /></ListItemIcon>
                  <ListItemText primary="Teams" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton onClick={() => setActiveTab('employees')}>
                  <ListItemIcon sx={{ color: '#b195fb' }}><BadgeIcon /></ListItemIcon>
                  <ListItemText primary="Employees" />
                </ListItemButton>
              </ListItem>
            </>
          )}

          <ListItem disablePadding>
            <ListItemButton onClick={() => setActiveTab('notifications')}>
              <ListItemIcon sx={{ color: '#b195fb' }}><NotificationsIcon /></ListItemIcon>
              <ListItemText primary="Notifications" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => setActiveTab('profile')}>
              <ListItemIcon sx={{ color: '#b195fb' }}><AccountCircleIcon /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Bottom: Avatar + Logout */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: '#b195fb', color: '#151A2D', fontWeight: 'bold' }}>{userInitial}</Avatar>
            <Box>
              <Typography sx={{ color: '#fff', fontWeight: '700' }}>{loggedInUser?.name || 'User'}</Typography>
              <Typography variant="body2" sx={{ color: '#b8b8d4' }}>{loggedInUser?.role?.toUpperCase()}</Typography>
            </Box>
          </Stack>
          <Badge badgeContent={loggedInUser?.role?.toUpperCase()} color="primary" />
        </Box>
        <Box sx={{ mt: 2 }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ color: '#FF6666' }}>
                <ListItemIcon sx={{ color: '#FF6666' }}><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Sign Out" sx={{ color: '#FF6666' }} />
              </ListItemButton>
            </ListItem>
          </List>
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
          <Typography variant="h5" color="text.secondary">Loading user data...</Typography>
        ) : !loggedInUser ? (
          <Typography variant="h5" color="error">Failed to load user data. Please log in again.</Typography>
        ) : (
          <>
            {/* TaskBoard no longer needs userData prop, it fetches its own */}
            {activeTab === "dashboard" && <TaskBoard />} 
            {activeTab === "mytasks" && <MyTask />}
            {activeTab === "teams" && <Team />}
            {activeTab === "employees" && <Employees />}
            {activeTab === "notifications" && <NotificationsComponent notifications={loggedInUser?.notifications} />}
            {activeTab === "profile" && <Profile />}
            {activeTab === "assignTask" && <AssignTask />}
          </>
        )}
      </Box>
    </Box>
  );
}
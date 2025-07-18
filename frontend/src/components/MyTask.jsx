import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
  Grid,
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import { fetchUserData } from '../Services/userService.js';
import { fetchAssignedTasks } from '../Services/userService.js';
import TaskCard from './taskCard.jsx'; // <<<-- Corrected import path and added .jsx extension

const MyTask = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' });

  // Effect to fetch logged-in user data
  useEffect(() => {
    const getUser = async () => {
      setIsLoadingUser(true);
      try {
        const user = await fetchUserData();
        setLoggedInUser(user);
      } catch (error) {
        setAlert({
          open: true,
          severity: 'error',
          message: `Error loading user data: ${error.message}`,
        });
        setLoggedInUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    };
    getUser();
  }, []);

  // Effect to fetch tasks assigned to the logged-in user
  useEffect(() => {
    const getAssignedTasks = async () => {
      if (loggedInUser && loggedInUser._id) {
        setIsLoadingTasks(true);
        try {
          const tasks = await fetchAssignedTasks(loggedInUser._id);
          setAssignedTasks(tasks);
        } catch (error) {
          setAlert({
            open: true,
            severity: 'error',
            message: `Error fetching assigned tasks: ${error.message}`,
          });
          setAssignedTasks([]);
        } finally {
          setIsLoadingTasks(false);
        }
      }
    };

    if (loggedInUser && !isLoadingUser) {
      getAssignedTasks();
    }
  }, [loggedInUser, isLoadingUser]);

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  if (isLoadingUser) {
    return (
      <Box sx={{
        p: 4,
        backgroundColor: '#121212',
        minHeight: '100vh',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <CircularProgress sx={{ color: '#b195fb' }} />
        <Typography variant="h6" sx={{ ml: 2, color: '#ccc' }}>Loading user data...</Typography>
      </Box>
    );
  }

  if (!loggedInUser) {
    return (
      <Box sx={{
        p: 4,
        backgroundColor: '#121212',
        minHeight: '100vh',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Typography variant="h5" color="error">
          Error: User data could not be loaded. Please log in again.
        </Typography>
        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={handleAlertClose}
        >
          <Alert onClose={handleAlertClose} severity={alert.severity} sx={{ width: '100%' }}>
            {alert.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: '#121212', minHeight: '100vh', width:"90vw", color: 'white' }}>
      <Paper elevation={6} sx={{ p: 3, backgroundColor: '#1e1e2f', borderRadius: 4, width:"81vw", height:"auto" }}> {/* Adjusted width/height for Paper */}
        <Typography variant="h4" fontWeight="bold" gutterBottom color="#b195fb">
          🎯 {loggedInUser.name}&apos;s Assigned Tasks
          <br />
          <BadgeIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Role: {loggedInUser.role}
        </Typography>

        <Typography variant="h6" sx={{ mb: 3, color: '#ccc' }}>
          Here are the tasks assigned to you:
        </Typography>

        {isLoadingTasks ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress sx={{ color: '#b195fb' }} />
            <Typography variant="subtitle1" sx={{ ml: 2, color: '#ccc' }}>Loading tasks...</Typography>
          </Box>
        ) : assignedTasks.length === 0 ? (
          <Typography variant="h6" color="textSecondary" sx={{ mt: 4, textAlign: 'center', color: '#888' }}>
            No tasks assigned to you yet.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {assignedTasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task._id}> {/* Adjusted grid sizes for better responsiveness */}
                <TaskCard task={task} loggedInUserRole={loggedInUser.role} /> {/* Pass loggedInUserRole */}
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Alerts */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={handleAlertClose}
      >
        <Alert
          severity={alert.severity}
          variant="filled"
          onClose={handleAlertClose}
          sx={{
            backgroundColor: alert.severity === 'success' ? '#81c784' : '#e57373',
            color: '#000',
          }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyTask;
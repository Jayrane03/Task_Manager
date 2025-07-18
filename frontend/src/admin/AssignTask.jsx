import  { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Avatar,
  CircularProgress,
  Stack
} from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import { BASE_URL } from '../Services/service'; // Replace with your actual service

const AssignTask = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchUsers = async () => {
    try {
     const response = await fetch(`${BASE_URL}/users/all`);
const data = await response.json();
setUsers(data);  // Each user now has pendingTasks & completedTasks

    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchUsers();
}, []);


  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#151A2D', fontWeight: 600 }}>
        Assign Tasks
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {users.map((user, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, background: '#f4f0ff' }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: deepPurple[500] }}>{user.name[0]}</Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ color: '#151A2D' }}>{user.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                      <Typography variant="body2" color="text.secondary">Team: {user.team || 'Unassigned'}</Typography>
                    </Box>
                  </Stack>

                  <Box mt={2}>
                    <Typography variant="subtitle2" sx={{ color: '#4d2da7' }}>
                      Pending Tasks: {user.pendingTasks || 0}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: '#4d2da7' }}>
                      Completed Tasks: {user.completedTasks || 0}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AssignTask;

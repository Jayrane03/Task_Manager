import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Avatar,
  CircularProgress,
  Stack,
  Chip,
  Divider,
} from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import { BASE_URL } from '../Services/service'; // Replace with your actual service

const AssignTask = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamFilter, setTeamFilter] = useState('All');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/all`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const teams = ['All', ...new Set(users.map((user) => user.team || 'Unassigned'))];

  const visibleUsers = teamFilter === 'All' ? users : users.filter((user) => (user.team || 'Unassigned') === teamFilter);

  return (
    <Box sx={{ padding: 4, minHeight: '100vh', backgroundColor: '#0d0d20' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ color: '#ffffff', fontWeight: 700 }}>
            Team Assignment Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: '#b5b5d1', maxWidth: 640 }}>
            Review employee workload, team assignments, and admin notification readiness before assigning the next high-priority task.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label={`Employees: ${users.length}`} sx={{ backgroundColor: '#2c2c4e', color: '#fff', fontWeight: 600 }} />
          <Chip label={`Active Team Filters`} sx={{ backgroundColor: '#2c2c4e', color: '#fff', fontWeight: 600 }} />
        </Stack>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress sx={{ color: '#b195fb' }} />
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {teams.map((teamOption) => (
              <Chip
                key={teamOption}
                label={teamOption}
                onClick={() => setTeamFilter(teamOption)}
                clickable
                color={teamFilter === teamOption ? 'secondary' : 'default'}
                sx={{ backgroundColor: teamFilter === teamOption ? '#b195fb' : '#1e1e2f', color: '#fff', fontWeight: 600 }}
              />
            ))}
          </Box>

          <Grid container spacing={3} alignItems="stretch">
            {visibleUsers.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user._id}>
                <Card sx={{ borderRadius: 3, backgroundColor: '#14142c', boxShadow: '0 18px 40px rgba(0, 0, 0, 0.2)' }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Avatar sx={{ bgcolor: deepPurple[500], width: 56, height: 56, fontSize: 22 }}>
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700 }}>
                          {user.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#b5b5d1' }}>
                          {user.title || 'Team Member'}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                      <Chip label={user.role || 'employee'} size="small" sx={{ backgroundColor: '#26264a', color: '#fff' }} />
                      <Chip label={`Team: ${user.team || 'Unassigned'}`} size="small" sx={{ backgroundColor: '#26264a', color: '#fff' }} />
                      {typeof user.unreadNotifications === 'number' && user.unreadNotifications > 0 && (
                        <Chip label={`🔔 ${user.unreadNotifications}`} size="small" sx={{ backgroundColor: '#7b1fa2', color: '#fff' }} />
                      )}
                    </Stack>

                    <Divider sx={{ borderColor: '#2f2f55', mb: 2 }} />

                    <Stack spacing={1}>
                      <Typography variant="body2" sx={{ color: '#9fa0c7' }}>
                        <strong>Pending tasks:</strong> {user.pendingTasks || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#9fa0c7' }}>
                        <strong>Completed tasks:</strong> {user.completedTasks || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#9fa0c7' }}>
                        <strong>Email:</strong> {user.email}
                      </Typography>
                      {user.department && (
                        <Typography variant="body2" sx={{ color: '#9fa0c7' }}>
                          <strong>Department:</strong> {user.department}
                        </Typography>
                      )}
                    </Stack>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label="Assign Task" clickable sx={{ backgroundColor: '#b195fb', color: '#121010', fontWeight: 700 }} />
                      <Chip label="View Load" clickable sx={{ backgroundColor: '#2e354b', color: '#fff' }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default AssignTask;

import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, Box, CircularProgress, Chip, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../Services/service';
import { companyTeams } from '../Services/teams_service';

const Employees = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teams, setTeams] = useState([...companyTeams]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users/all`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignClick = (user) => {
    setSelectedUser(user);
    setSelectedTeam(user.team || '');
    setOpenDialog(true);
  };
  
  const handleAssignTeam = async () => {
    if (!selectedUser || !selectedTeam) return;

    try {
      const res = await fetch(`${BASE_URL}/users/assign-team/${selectedUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team: selectedTeam }),
      });

      if (!res.ok) {
        throw new Error('Failed to assign team');
      }

      const updatedUser = await res.json();

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );
    } catch (error) {
      console.error('Error assigning team:', error);
    } finally {
      setOpenDialog(false);
      setSelectedUser(null);
      setSelectedTeam('');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={6} sx={{ p: 3, borderRadius: '16px', backgroundColor: '#f8f9fa', width: "80vw" }}>
        <Typography variant="h5" fontWeight="bold" color="#4d2da7" gutterBottom>
          Employee Directory
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" py={5}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: '#4d2da7', color: 'white' }}>Name</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#4d2da7', color: 'white' }}>Email</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#4d2da7', color: 'white' }}>Role</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#4d2da7', color: 'white' }}>Team</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user._id} hover sx={{ '&:hover': { backgroundColor: '#e3f2fd' } }}>
                      <TableCell sx={{ fontSize: '15px' }}>{user.name}</TableCell>
                      <TableCell align="center" sx={{ fontSize: '15px' }}>{user.email}</TableCell>
                      <TableCell align="center" sx={{ fontSize: '15px' }}>
                        <Chip
                          label={user.role}
                          color={user.role === 'admin' ? 'error' : 'primary'}
                          size="small"
                          sx={{ textTransform: 'capitalize', fontWeight: 'bold', fontSize: '13px' }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: '15px' }}>
                        {user.role === 'admin' ? (
                          <Chip label="Admin Team" color="error" size="small" />
                        ) : (
                          <>
                            {user.team ? (
                              <Chip
                                label={user.team}
                                color="success"
                                size="small"
                                sx={{ mr: 1, fontSize: '13px', fontWeight: 'bold' }}
                              />
                            ) : (
                              <Chip
                                label="No Team"
                                color="default"
                                size="small"
                                sx={{ mr: 1, fontSize: '13px', fontWeight: 'bold' }}
                              />
                            )}
                            <Button
                              variant="contained"
                              size="small"
                               sx={{backgroundColor:"#4d2da7"}}
                              onClick={() => handleAssignClick(user)}
                            >
                              {user.team ? 'Update Team' : 'Assign Team'}
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Assign Team Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Assign Team to {selectedUser?.name}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="team-select-label">Team</InputLabel>
            <Select
              labelId="team-select-label"
              value={selectedTeam}
              label="Team"
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.name}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={handleAssignTeam} variant="contained" sx={{backgroundColor:"#4d2da7"}}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Employees;

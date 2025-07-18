// src/components/taskBoard.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  Typography,
  Grid,
 Chip,
  Paper,
  CircularProgress,
} from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';
import AssignmentIcon from '@mui/icons-material/Assignment'; // New: Icon for dialog title
import { BASE_URL } from '../Services/service';
import StatusCard from './statusCard';
import { fetchUserData } from '../Services/userService';
import BadgeIcon from '@mui/icons-material/Badge';
import { companyTeams } from '../Services/teams_service'; // Make sure this path is correct

const TaskBoard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' });
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false); // New: Loading state for teams

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    team: '', // Initialize team to empty string
    user: '',
    assignee: '',
    priority: '',
    status: 'Pending',
  });
  const [tasks, setTasks] = useState([]);
  const [groupedTasks, setGroupedTasks] = useState({});
  // No need to set `teams` in state if it's imported as a constant
  // const [teams , setTeams] = useState([...companyTeams]); // Remove this line if companyTeams is static

  const teamsAssigned = companyTeams; // Directly use the imported constant

  // Effect to fetch user data on component mount
  useEffect(() => {
    const getUser = async () => {
      setIsLoadingUser(true);
      try {
        const user = await fetchUserData();
        setLoggedInUser(user);
        if (user && user._id) {
          setTaskData((prev) => ({ ...prev, user: user._id }));
        }
      } catch (error) {
        setAlert({
          open: true,
          severity: 'error',
          message: `Error loading user data: ${error.message}`,
        });
      } finally {
        setIsLoadingUser(false);
      }
    };
    getUser();
  }, []);

  // Effect to fetch all users for assignee dropdown when modal opens (if admin)
  useEffect(() => {
    if (isModalOpen && loggedInUser?.role === 'admin') {
      fetchAllUsers();
      // If teams were dynamic, you'd fetch them here too:
      // fetchAllTeams();
    }
  }, [isModalOpen, loggedInUser]);

  // Function to fetch all users for assignee dropdown
  const fetchAllUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await fetch(`${BASE_URL}/users/all`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const users = await response.json();
      setAllUsers(users);
    } catch (error) {
      setAlert({
        open: true,
        severity: 'error',
        message: `Error fetching users: ${error.message}`,
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Effect to fetch tasks when loggedInUser is available
  useEffect(() => {
    if (loggedInUser && loggedInUser._id) {
      fetchTasks();
    }
  }, [loggedInUser]);

  // Function to fetch tasks - different logic for admin vs employee
  const fetchTasks = async () => {
    if (!loggedInUser || !loggedInUser._id) {
      console.warn('User data is not available for fetching tasks.');
      return;
    }

    try {
      let endpoint;
      if (loggedInUser.role === 'admin') {
        endpoint = `${BASE_URL}/task/user/${loggedInUser._id}`;
      } else {
        endpoint = `${BASE_URL}/task/assigned/${loggedInUser._id}`;
      }

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      setAlert({
        open: true,
        severity: 'error',
        message: `Error fetching tasks: ${error.message}`,
      });
    }
  };

  // Group tasks by status whenever the tasks state changes
  useEffect(() => {
    if (Array.isArray(tasks)) {
      const newGroupedTasks = tasks.reduce((acc, task) => {
        const status = task.status || 'Pending';
        if (!acc[status]) {
          acc[status] = [];
        }
        acc[status].push(task);
        return acc;
      }, {});
      setGroupedTasks(newGroupedTasks);
    }
  }, [tasks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loggedInUser || !loggedInUser._id) {
      setAlert({
        open: true,
        severity: 'error',
        message: 'User not logged in or ID missing. Cannot create task.',
      });
      return;
    }

    // Validate required fields
    if (!taskData.title || !taskData.description || !taskData.assignee || !taskData.team) { // Added team validation
      setAlert({
        open: true,
        severity: 'error',
        message: 'Please fill in all required fields (Title, Description, Team, Assignee)',
      });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/task/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...taskData, user: loggedInUser._id }),
      });

      if (response.ok) {
        setAlert({
          open: true,
          severity: 'success',
          message: 'Task created and assigned successfully',
        });
        fetchTasks();
        setIsModalOpen(false);
        setTaskData({
          title: '',
          description: '',
          team: '', // Reset team field
          assignee: '',
          priority: '',
          user: loggedInUser._id,
          status: 'Pending',
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create task');
      }
    } catch (error) {
      setAlert({ open: true, severity: 'error', message: error.message });
    }
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
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#121212', height:"auto",  width:"100vw",color: 'white', p: 4 }}>
      <Paper elevation={6} sx={{ p: 3, backgroundColor: '#1e1e2f', borderRadius: 4 }}>


<Box
  component={Paper}
  elevation={4}
  sx={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    p: 3,
    mb: 3,
    backgroundColor: '#1e1e2f',
    borderRadius: 3,
    flexWrap: 'wrap',
  }}
>
  <Typography
    variant="h4"
    fontWeight="bold"
    gutterBottom
    color="#b195fb"
  >
    🚀 {loggedInUser.name}&apos;s Task Board
  </Typography>

  <Chip
  icon={<BadgeIcon />}
  label={`Role: ${loggedInUser.role.toUpperCase()}`}
  sx={{
    position: 'absolute',
    left: '87%',
    padding: '10px',
    backgroundColor:
      loggedInUser.role === 'admin' ? '#f44336' : '#2196f3',
    color: '#fff',
    fontSize: '16px',
    height: '60px',
    boxShadow: `0px 0px 15px ${
      loggedInUser.role === 'admin' ? '#f44336' : '#2196f3'
    }`,
    '& .MuiChip-icon': {
      color: '#fff',
      fontSize: '24px',
    },
  }}
/>

</Box>

    
        <Typography variant="h6" sx={{ mb: 2, color: '#ccc' }}>
          {loggedInUser.role === 'admin'
            ? 'Tasks you have created'
            : 'Tasks assigned to you'
          }
        </Typography>

        {loggedInUser?.role === "admin" && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#b195fb',
                color: '#121010',
                '&:hover': { backgroundColor: '#9c7cf5' },
                borderRadius: 2,
                fontWeight: 'bold',
                py: 1.5, // Increase vertical padding
                px: 3, // Increase horizontal padding
                fontSize: '1rem',
              }}
              onClick={() => setIsModalOpen(true)}
            >
              <AddTaskIcon sx={{ verticalAlign: "middle", mr: 1 }} /> Add New Task
            </Button>
          </Box>
        )}

        {/* Task Creation Dialog */}
        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          fullWidth
          maxWidth="sm" // Changed to 'sm' for a slightly more compact dialog
          PaperProps={{
            sx: {
              backgroundColor: '#83838d',
              color: 'white',
              borderRadius: 4, // More rounded corners
              boxShadow: '0 8px 20px rgba(0,0,0,0.5)', // Deeper shadow
              border: '1px solid #b195fb', // Subtle border with theme color
            }
          }}
        >
          <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 2, mb: 2 }}>
            <Typography variant="h5" component="div" fontWeight="bold" color="#b195fb" display="flex" alignItems="center">
              <AssignmentIcon sx={{ mr: 1, fontSize: 30 }} /> Create New Task
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 2, pb: 2 }}> {/* Added vertical padding */}
            <Grid container spacing={3}> {/* Increased spacing between grid items */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Title *"
                  name="title"
                  value={taskData.title}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ style: { color: '#ccc' } }}
                  InputProps={{
                    style: { color: '#fff' },
                    sx: { '& fieldset': { borderColor: '#b195fb' }, '&:hover fieldset': { borderColor: '#9c7cf5' }, '&.Mui-focused fieldset': { borderColor: '#b195fb' } }
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel style={{ color: '#ccc' }}>Team *</InputLabel>
                  <Select
                    name="team" // FIXED: Changed name to "team"
                    value={taskData.team}
                    onChange={handleChange}
                    label="Team *" // FIXED: Changed label to "Team *"
                    sx={{
                        width:"200px",
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#b195fb' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9c7cf5' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#b195fb' },
                      '& .MuiSvgIcon-root': { color: '#fff' }, // Arrow color
                    }}
                    MenuProps={{ // Style for the dropdown menu
                      PaperProps: {
                        sx: {
                          backgroundColor: '#2a2a3e', // Background of dropdown items
                          color: '#fff',
                        },
                      },
                    }}
                    // Adjusted disabled condition: only disable if actually loading teams
                    disabled={isLoadingTeams} // Assuming isLoadingTeams might be true if teams were fetched async
                  >
                    {isLoadingTeams ? ( // Use isLoadingTeams here
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ color: '#b195fb', mr: 1 }} /> Loading Teams...
                      </MenuItem>
                    ) : (
                      teamsAssigned.map((t) => ( // Use teamsAssigned constant
                        <MenuItem key={t.id} value={t.name}> {/* Set value to t.name */}
                          {t.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description *"
                  name="description"
                  value={taskData.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  InputLabelProps={{ style: { color: '#ccc' } }}
                  InputProps={{
                    style: { color: '#fff' },
                    sx: { '& fieldset': { borderColor: '#b195fb' }, '&:hover fieldset': { borderColor: '#9c7cf5' }, '&.Mui-focused fieldset': { borderColor: '#b195fb' } }
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel style={{ color: '#ccc' }}>Assign To *</InputLabel>
                  <Select
                    name="assignee"
                    value={taskData.assignee}
                    onChange={handleChange}
                    
                    sx={{
                         width:"200px",
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#b195fb' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9c7cf5' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#b195fb' },
                      '& .MuiSvgIcon-root': { color: '#fff' },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: '#2a2a3e',
                          color: '#fff',
                        },
                      },
                    }}
                    disabled={isLoadingUsers}
                  >
                    {isLoadingUsers ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ color: '#b195fb', mr: 1 }} /> Loading users...
                      </MenuItem>
                    ) : (
                      allUsers.map((user) => (
                        <MenuItem key={user._id} value={user._id}>
                          {user.name} ({user.email}) - {user.role}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: '#ccc' }}>Priority</InputLabel>
                  <Select
                    name="priority"
                    value={taskData.priority}
                    onChange={handleChange}
                    label="Priority"
                    sx={{
                             width:"10px",
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#b195fb' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9c7cf5' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#b195fb' },
                      '& .MuiSvgIcon-root': { color: '#fff' },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: '#2a2a3e',
                          color: '#fff',
                        },
                      },
                    }}
                  >
                    <MenuItem value=""><em>None</em></MenuItem> {/* Option for no priority */}
                    <MenuItem value="P0">P0 - Critical</MenuItem>
                    <MenuItem value="P1">P1 - High</MenuItem>
                    <MenuItem value="P2">P2 - Medium</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* {/* If you intend to have Status here, remove the one below and uncomment this one: */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: '#ccc' }}>Status</InputLabel>
                  <Select
                    name="status"
                    value={taskData.status}
                    onChange={handleChange}
                    label="Status"
                    sx={{
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#b195fb' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9c7cf5' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#b195fb' },
                      '& .MuiSvgIcon-root': { color: '#fff' },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: '#2a2a3e',
                          color: '#fff',
                        },
                      },
                    }}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Deployed">Deployed</MenuItem>
                    <MenuItem value="Deferred">Deferred</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* */}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', pt: 2, mt: 2, pr: 3, pb: 3 }}>
            <Button onClick={() => setIsModalOpen(false)} sx={{ color: '#b195fb', '&:hover': { backgroundColor: 'rgba(177, 149, 251, 0.1)' } }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{ backgroundColor: '#b195fb', '&:hover': { backgroundColor: '#9a7cf5' }, fontWeight: 'bold', px: 3 }}
            >
              Create & Assign Task
            </Button>
          </DialogActions>
        </Dialog>

        {/* Alerts */}
        <Snackbar
          open={alert.open}
          autoHideDuration={4000}
          onClose={() => setAlert({ ...alert, open: false })}
        >
          <Alert
            severity={alert.severity}
            variant="filled"
            onClose={() => setAlert({ ...alert, open: false })}
            sx={{
              backgroundColor: alert.severity === 'success' ? '#81c784' : '#e57373',
              color: '#000',
            }}
          >
            {alert.message}
          </Alert>
        </Snackbar>

        {/* Status Columns */}
        
    <StatusCard tasks={groupedTasks} fetchTasks={fetchTasks} loggedInUserRole={loggedInUser.role} /> {/* <<<-- PASS loggedInUserRole */}
      </Paper>
    </Box>
  );
};

export default TaskBoard;
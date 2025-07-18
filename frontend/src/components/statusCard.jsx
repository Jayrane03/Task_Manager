import { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Button,
  Typography,
  // Removed Card, CardContent, CardActions, Button, Chip, Avatar, Tooltip
  // because they are now used inside the standalone TaskCard
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  Chip,
  InputLabel,
 // Keep Tooltip for general use if any
} from '@mui/material';
import {
  // Removed EditIcon, PersonIcon, ScheduleIcon, AssignmentIcon
  // because they are used inside the standalone TaskCard
} from '@mui/icons-material';
import { BASE_URL } from '../Services/service';
import PropTypes from 'prop-types';
import TaskCard from './taskCard.jsx'; // <<<-- IMPORT THE STANDALONE TaskCard

const StatusCard = ({ tasks, fetchTasks, loggedInUserRole }) => { // Added loggedInUserRole prop
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  // Define colors here or import from a constants file, if they are not used in TaskCard already
  // (Note: If TaskCard is the only place using these, you can remove them from here)
  const statusColors = {
    Pending: '#ff9800',
    'In Progress': '#2196f3',
    Completed: '#4caf50',
    Deployed: '#9c27b0',
    Deferred: '#f44336',
  };

  // priorityColors are only used in TaskCard, so they should be defined there or in a central config.
  // const priorityColors = { /* ... */ };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setNewStatus(task.status);
    setIsEditDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedTask) return;

    try {
      const response = await fetch(`${BASE_URL}/task/update/${selectedTask._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchTasks(); // Refresh the task list
        setIsEditDialogOpen(false);
        setSelectedTask(null);
      } else {
        // Handle error from backend
        const errorData = await response.json();
        console.error('Failed to update task:', errorData.message);
        // You might want to show an alert here
      }
    } catch (error) {
      console.error('Error updating task:', error);
      // You might want to show an alert here
    }
  };

  const getStatusColumns = () => {
    return ['Pending', 'In Progress', 'Completed', 'Deployed', 'Deferred'];
  };

  // formatDate is now in TaskCard, no need here unless StatusCard also directly uses it.
  // const formatDate = (dateString) => { /* ... */ };

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {getStatusColumns().map((status) => (
          <Grid item xs={12} sm={6} md={2.4} key={status}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                backgroundColor: '#1a1a2e',
                borderRadius: 2,
                border: `2px solid ${statusColors[status]}`,
                minHeight: '500px',
                display: 'flex', // Use flex for column content
                flexDirection: 'column', // Align content in column
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: statusColors[status],
                    fontWeight: 'bold',
                    flex: 1,
                  }}
                >
                  {status}
                </Typography>
                <Chip
                  label={tasks[status]?.length || 0}
                  size="small"
                  sx={{
                    backgroundColor: statusColors[status],
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
              </Box>

              <Box sx={{ maxHeight: '450px', overflowY: 'auto', flexGrow: 1, pr: 1 }}> {/* Added pr for scrollbar space */}
                {tasks[status]?.length > 0 ? (
                  tasks[status].map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEditTask={handleEditTask} // Pass the edit handler
                      loggedInUserRole={loggedInUserRole} // Pass user role for conditional rendering
                    />
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666',
                      textAlign: 'center',
                      mt: 4,
                      fontStyle: 'italic',
                    }}
                  >
                    No tasks in {status.toLowerCase()}
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Edit Status Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { backgroundColor: '#1e1e2f', color: 'white' } }}
      >
        <DialogTitle>Update Task Status</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Task: <strong>{selectedTask?.title}</strong>
          </Typography>
        <FormControl fullWidth>
  <InputLabel
    id="edit-status-label"
    sx={{ color: '#ededf0' , zIndex:"100", position:"absolute", top:"6%",left:"-4%"}}
  >
    Status
  </InputLabel>
  <Select
    labelId="edit-status-label"
    id="edit-status-select"
    value={newStatus}
    onChange={(e) => setNewStatus(e.target.value)}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)} sx={{ color: '#b195fb' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateStatus}
            sx={{ backgroundColor: '#b195fb', '&:hover': { backgroundColor: '#9a7cf5' } }}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Prop types for StatusCard
StatusCard.propTypes = {
  tasks: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.object)).isRequired, // tasks is an object with arrays of task objects
  fetchTasks: PropTypes.func.isRequired,
  loggedInUserRole: PropTypes.string, // Add prop type for loggedInUserRole
};

export default StatusCard;
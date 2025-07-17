// src/components/StatusCard.jsx
import  { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { BASE_URL } from '../Services/service';
import PropTypes from 'prop-types';
const StatusCard = ({ tasks, fetchTasks }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const statusColors = {
    Pending: '#ff9800',
    'In Progress': '#2196f3',
    Completed: '#4caf50',
    Deployed: '#9c27b0',
    Deferred: '#f44336',
  };

  const priorityColors = {
    P0: '#f44336',
    P1: '#ff9800',
    P2: '#4caf50',
  };

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
        throw new Error('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getStatusColumns = () => {
    return ['Pending', 'In Progress', 'Completed', 'Deployed', 'Deferred'];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const TaskCard = ({ task }) => (
    <Card
      sx={{
        backgroundColor: '#2d2d3f',
        color: 'white',
        mb: 2,
        borderLeft: `4px solid ${statusColors[task.status]}`,
        '&:hover': {
          boxShadow: '0 8px 16px rgba(177, 149, 251, 0.3)',
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.3s ease',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: '#b195fb' }}>
            {task.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {task.priority && (
              <Chip
                label={task.priority}
                size="small"
                sx={{
                  backgroundColor: priorityColors[task.priority],
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            )}
            <Chip
              label={task.status}
              size="small"
              sx={{
                backgroundColor: statusColors[task.status],
                color: 'white',
              }}
            />
          </Box>
        </Box>

        <Typography variant="body2" sx={{ color: '#ccc', mb: 2 }}>
          {task.description}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {task.team && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AssignmentIcon sx={{ fontSize: 16, color: '#b195fb' }} />
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                Team: {task.team}
              </Typography>
            </Box>
          )}

          {task.assignee && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon sx={{ fontSize: 16, color: '#b195fb' }} />
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                Assigned to: {task.assignee.name || task.assignee.email}
              </Typography>
            </Box>
          )}

          {task.user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 16, height: 16, fontSize: 10, bgcolor: '#b195fb' }}>
                {task.user.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                Created by: {task.user.name || task.user.email}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ScheduleIcon sx={{ fontSize: 16, color: '#b195fb' }} />
            <Typography variant="body2" sx={{ color: '#ccc' }}>
              {formatDate(task.createdAt)}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <Tooltip title="Update Status">
          <IconButton
            onClick={() => handleEditTask(task)}
            sx={{
              color: '#b195fb',
              '&:hover': { backgroundColor: 'rgba(177, 149, 251, 0.1)' },
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );

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

              <Box sx={{ maxHeight: '450px', overflowY: 'auto' }}>
                {tasks[status]?.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
                {(!tasks[status] || tasks[status].length === 0) && (
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
            <InputLabel style={{ color: '#ccc' }}>Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Status"
              sx={{ color: '#fff' }}
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
StatusCard.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    team: PropTypes.string,
    user: PropTypes.string.isRequired, // ID of the user who created the task
    assignee: PropTypes.oneOfType([
      PropTypes.string, // If assignee is just the ID
      PropTypes.shape({ // If assignee is a populated user object
        _id: PropTypes.string.isRequired,
        name: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.string,
      }),
    ]).isRequired,
    priority: PropTypes.string,
    status: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default StatusCard;
// src/components/TaskCard.jsx

import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import PropTypes from 'prop-types';
// Optional: If you want to add prop-types for validation (recommended)
// import PropTypes from 'prop-types';

const TaskCard = ({ task }) => {
  // Define statusColors object here or import it if shared across components.
  // This is the fix for 'statusColors is not defined' when setting borderLeft.
  const statusColors = {
    'Pending': '#ffa726',    // Orange
    'In Progress': '#29b6f6', // Light Blue
    'Completed': '#66bb6a',  // Green
    'Deployed': '#9c27b0',   // Purple
    'Deferred': '#ef5350',   // Red
  };

  // Helper to get color for Material-UI Chip component's 'color' prop
  const getStatusChipColor = (status) => {
    switch (status) {
      case 'Pending': return 'info';
      case 'In Progress': return 'primary';
      case 'Completed': return 'success';
      case 'Deployed': return 'secondary';
      case 'Deferred': return 'warning';
      default: return 'default';
    }
  };

  const getPriorityChipColor = (priority) => {
    switch (priority) {
      case 'P0': return 'error';
      case 'P1': return 'warning';
      case 'P2': return 'info';
      default: return 'default';
    }
  };

  return (
    <Card
      sx={{
        backgroundColor: '#2a2a3e', // Slightly lighter dark than the background
        color: 'white',
        mb: 2, // Add margin-bottom for spacing between cards, as seen in your image hint
        borderRadius: 2,
        boxShadow: 3,
        height: '25vh',
        width:"30vw", // Ensure cards in a grid have same height
        display: 'flex',
        flexDirection: 'column',
        // FIX FOR BORDERLEFT:
        // Use template literal correctly and provide a fallback color
        borderLeft: `4px solid ${statusColors[task.status] || '#ccc'}`,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', // Smooth transition for hover
        '&:hover': {
          boxShadow: '0 8px 16px rgba(177, 149, 251, 0.3)', // Your desired hover shadow
          transform: 'translateY(-2px)', // Slightly lift the card on hover
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: '#b195fb' }}>
            {task.title}
          </Typography>
          {task.priority && (
            <Chip
              label={task.priority}
              color={getPriorityChipColor(task.priority)}
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          )}
        </Box>
        <Typography variant="body2" color="#ccc" sx={{ mb: 1 }}>
          {task.description}
        </Typography>
        {task.team && (
          <Typography variant="caption" color="#aaa" sx={{ mb: 0.5 }}>
            Team: {task.team}
          </Typography>
        )}
        {/* Assumes task.assignee is an object with name/email/id or just an ID */}
        {task.assignee && (
          <Typography variant="caption" color="#aaa" sx={{ mb: 0.5 }}>
            Assigned To: {task.assignee.name || task.assignee.email || task.assignee._id}
          </Typography>
        )}
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {task.status && (
            <Chip
              label={task.status}
              color={getStatusChipColor(task.status)}
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          )}
          <Typography variant="caption" color="#888">
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Optional: Prop validation for better development experience

TaskCard.propTypes = {
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
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};


export default TaskCard;
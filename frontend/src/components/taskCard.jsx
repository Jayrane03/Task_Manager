import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Avatar,
  CardActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon, // Make sure EditIcon is imported if you want to use it in the card
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types'; // Keep prop-types here as it's for TaskCard

// Define colors here or import from a constants file
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

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// TaskCard component
const TaskCard = ({ task, onEditTask, loggedInUserRole }) => { // Added onEditTask and loggedInUserRole props
  return (
    <Card
      sx={{
        backgroundColor: '#2d2d3f',
        color: 'white',
        mb: 2,
        borderLeft: `4px solid ${statusColors[task.status] || '#ccc'}`, // Added fallback color
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
                  backgroundColor: priorityColors[task.priority] || '#666', // Added fallback color
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            )}
            <Chip
              label={task.status}
              size="small"
              sx={{
                backgroundColor: statusColors[task.status] || '#666', // Added fallback color
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
                Assigned to: {task.assignee.name || task.assignee.email || task.assignee._id} {/* Added _id fallback */}
              </Typography>
            </Box>
          )}

          {task.user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 16, height: 16, fontSize: 10, bgcolor: '#b195fb' }}>
                {task.user.name?.charAt(0).toUpperCase() || '?'} {/* Added '?' fallback for charAt(0) */}
              </Avatar>
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                Created by: {task.user.name || task.user.email || task.user._id} {/* Added _id fallback */}
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

      {/* Only show edit button if onEditTask is provided and user is admin */}
      {onEditTask && loggedInUserRole === 'admin' && (
        <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
          <Tooltip title="Update Status">
            <IconButton
              onClick={() => onEditTask(task)}
              sx={{
                color: '#b195fb',
                '&:hover': { backgroundColor: 'rgba(177, 149, 251, 0.1)' },
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      )}
    </Card>
  );
};

// Prop types for TaskCard
TaskCard.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    team: PropTypes.string,
    user: PropTypes.oneOfType([
      PropTypes.string, // if user is just an ID
      PropTypes.shape({ // if user is a populated object
        _id: PropTypes.string.isRequired,
        name: PropTypes.string,
        email: PropTypes.string,
      }),
    ]).isRequired,
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
    status: PropTypes.string, // Status might not be required if it has a default
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onEditTask: PropTypes.func, // onEditTask is optional
  loggedInUserRole: PropTypes.string, // loggedInUserRole is optional
};

export default TaskCard;
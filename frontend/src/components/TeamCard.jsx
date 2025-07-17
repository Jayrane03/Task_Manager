// src/components/TeamCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
} from '@mui/material';
import { styled } from '@mui/system'; // For custom styling if needed

// Import relevant icons (you might need to install @mui/icons-material)
import CodeIcon from '@mui/icons-material/Code'; // Frontend/Backend
import CloudIcon from '@mui/icons-material/Cloud'; // Cloud
import DataObjectIcon from '@mui/icons-material/DataObject'; // Data Analytics
import DnsIcon from '@mui/icons-material/Dns'; // DevOps/Infrastructure
import ScienceIcon from '@mui/icons-material/Science'; // AI/ML
import DesignServicesIcon from '@mui/icons-material/DesignServices'; // UI/UX
import SupportAgentIcon from '@mui/icons-material/SupportAgent'; // Support
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'; // Management/HR

// Custom styled Avatar for a unique look (optional)
const StyledAvatar = styled(Avatar)(({ theme, bgcolor }) => ({
  width: 60,
  height: 60,
  backgroundColor: bgcolor || '#b195fb', // Default purple
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
}));

const TeamCard = ({ team }) => {
  // Function to get the appropriate icon based on team type
  const getTeamIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'frontend':
      case 'backend':
        return <CodeIcon sx={{ fontSize: 32 }} />;
      case 'cloud':
      case 'devops':
        return <CloudIcon sx={{ fontSize: 32 }} />;
      case 'ai':
      case 'machine learning':
        return <ScienceIcon sx={{ fontSize: 32 }} />;
      case 'data analytics':
      case 'data science':
        return <DataObjectIcon sx={{ fontSize: 32 }} />;
      case 'infrastructure':
        return <DnsIcon sx={{ fontSize: 32 }} />;
      case 'ui/ux':
      case 'design':
        return <DesignServicesIcon sx={{ fontSize: 32 }} />;
      case 'support':
        return <SupportAgentIcon sx={{ fontSize: 32 }} />;
      case 'management':
      case 'hr':
        return <BusinessCenterIcon sx={{ fontSize: 32 }} />;
      default:
        return <BusinessCenterIcon sx={{ fontSize: 32 }} />; // Default icon
    }
  };

  // Function to get a unique background color for the avatar (optional)
  const getAvatarBgColor = (teamName) => {
    const colors = [
      '#ef5350', // red
      '#ffa726', // orange
      '#ffee58', // yellow
      '#66bb6a', // green
      '#29b6f6', // light blue
      '#b195fb', // purple from your theme
      '#ec407a', // pink
      '#ab47bc', // deep purple
    ];
    // Simple hash function to pick a color consistently
    let hash = 0;
    for (let i = 0; i < teamName.length; i++) {
      hash = teamName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
  };

  return (
    <Card
      sx={{
        backgroundColor: '#1e1e2f', // Dark background for the card
        color: 'white',
        borderRadius: 4, // More rounded corners
        boxShadow: '0 6px 16px rgba(245, 233, 233, 0.4)', // Deeper shadow
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Center content horizontally
        p: 2, // Padding inside the card
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px) scale(1.02)', // Lift and slightly enlarge on hover
          boxShadow: '0 12px 24px rgba(0,0,0,0.6)',
        },
      }}
    >
      <Box sx={{ mb: 2, mt: 1 }}>
        <StyledAvatar bgcolor={getAvatarBgColor(team.name)}>
          {getTeamIcon(team.type)}
        </StyledAvatar>
      </Box>
      <CardContent sx={{ flexGrow: 1, textAlign: 'center', width: '100%' }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: '#b195fb', mb: 1 }}>
          {team.name}
        </Typography>
        <Typography variant="body2" color="#ccc" sx={{ mb: 1.5 }}>
          {team.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
          {team.tags && team.tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              sx={{
                backgroundColor: 'rgba(177, 149, 251, 0.2)', // Light purple chip background
                color: '#b195fb', // Purple text
                fontWeight: 'bold',
                fontSize: '0.7rem',
              }}
            />
          ))}
        </Box>
        {team.membersCount !== undefined && (
          <Typography variant="body2" color="#999" sx={{ mt: 2 }}>
            {team.membersCount} Members
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamCard;
// src/components/Team.jsx
import {
  Box,
  Typography,
  Grid,
  Container,
  Divider,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import TeamCard from './TeamCard'; // Import the TeamCard component

import { companyTeams } from '../Services/teams_service';// Mock Data for teams


const Team = () => {
  return (
    <Box sx={{ p: 4, backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom

          align="center"
          sx={{ color: '#b195fb', mb: 4 , overflow:"hidden" }}
        >
          <GroupIcon sx={{ fontSize: 40, mr: 1  , verticalAlign:"middle"}} /> Our Amazing Teams
        </Typography>

        <Typography variant="h6" align="center" color="#ccc" sx={{ mb: 6 }}>
          Meet the diverse teams that power our innovation and drive success.
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {companyTeams.map((team) => (
            <Grid item key={team.id} xs={12} sm={6} md={4} lg={3}>
              <TeamCard team={team} />
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 8, borderColor: 'rgba(255,255,255,0.1)' }} />

        <Typography variant="h5" align="center" color="#b195fb" sx={{ mb: 2 }}>
          Want to join us?
        </Typography>
        <Typography variant="body1" align="center" color="#ccc">
          Explore career opportunities and become a part of our dynamic environment!
        </Typography>
      </Container>
    </Box>
  );
};

export default Team;
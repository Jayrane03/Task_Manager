// src/components/Dashboard.jsx
import {
  Box,
  CssBaseline,
} from '@mui/material';
import Sidebar from '../components/Sidebar';

// eslint-disable-next-line react/prop-types
export default function Dashboard({ userData }) 
   
{
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar userData={userData} />
    </Box>
  );
}
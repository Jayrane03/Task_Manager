// src/components/Dashboard.jsx
import {
  Box,
  CssBaseline,
} from '@mui/material';
import Sidebar from '../components/Sidebar';

export default function Dashboard({ userData }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar userData={userData} />
    </Box>
  );
}
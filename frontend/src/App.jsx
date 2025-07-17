// import React from 'react'; 

import LoginForm  from './Pages/Login';
import RegisterForm from './Pages/Register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
// import DashboardLayoutBasic from './components/Dashboard';
import Dashboard from './components/Dashboard';
// import AdminDashboard from './admin/AdminDashboard';

const App = () => {
  
  return (
    <Router> {/* Wrap Routes with Router */}
      <Routes>
        {/* <Route path="/home" element={<Home />} /> Use element prop instead of component prop */}
        <Route path="/login" element={<LoginForm />} /> {/* Use element prop instead of component prop */}
        <Route path="/" element={<RegisterForm />} /> {/* Use element prop instead of component prop */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Use element prop instead of component prop */}
        {/* <Route path="/admin-dashboard" element={<AdminDashboard />} /> Use element prop instead of component prop */}
      </Routes>
    </Router>
  );
}

export default App;

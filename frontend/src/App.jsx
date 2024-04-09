import React from 'react'; 
import Home from './Pages/Home';
import LoginForm  from './Pages/Login';
import RegisterForm from './Pages/Register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 

const App = () => {
  return (
    <Router> {/* Wrap Routes with Router */}
      <Routes>
        <Route path="/home" element={<Home />} /> {/* Use element prop instead of component prop */}
        <Route path="/login" element={<LoginForm />} /> {/* Use element prop instead of component prop */}
        <Route path="/" element={<RegisterForm />} /> {/* Use element prop instead of component prop */}
      </Routes>
    </Router>
  );
}

export default App;

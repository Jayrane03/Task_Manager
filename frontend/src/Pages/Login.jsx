import React, { useState } from 'react';
import loginImg from "/Images/login_1.jpg";
import '../Styles/pages.css';
import { BASE_URL } from '../Services/service';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    name: '', // Add name field
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
      });
      const data = await response.json();
  
      if (response.ok) {
        if (data.token) {
          // Clear previous token (if any)
          localStorage.removeItem('token');
          
          // Set new token
          localStorage.setItem('token', data.token);
          console.log('Token set:', data.token);
  
          // Alert welcome message
          alert(`Welcome ${data.user.name}`);
  
          // Redirect to the "/home" route after successful login
          window.location.href = '/home';
        } else {
          setError('Please check your email or password');
        }
      } else {
        setError('Please check your email or password');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="login">
      <div className="login-form-container">
        <div className="image">
          <img src={loginImg} alt="Background" />
        </div>
        <div className="form-container">
          <h2 className='form_label'>Login</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleLogin}>
          
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <a href="/" className='link'>Create a New Account</a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

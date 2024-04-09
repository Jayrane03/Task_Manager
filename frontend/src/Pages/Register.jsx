import React, { useState } from 'react';
import '../Styles/pages.css';
import signUpImg from "/Images/sign.jpg";
import { BASE_URL } from "../Services/service";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  async function registerUser(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const response = await fetch(`${BASE_URL}`, {
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
        // Check if token is present in the response data
        if (data.token) {
          // Store token in localStorage upon successful registration
          localStorage.setItem('token', data.token);
          alert("Registration Successful");
          // Redirect to login page
          window.location.href = '/login';
        } else {
          throw new Error('Token missing in response data');
        }
      } else {
        // Handle registration failure
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="register">
      <div className="register-form-container">
        <div className="image-container">
          <img src={signUpImg} alt="Background" />
        </div>
        <div className="form-container">
          <h2 className='form_label'>Register</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={registerUser}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
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
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          <a href="/login" className='link'>Already have a account</a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;

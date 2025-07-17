import { useState } from 'react';
import Alert from '@mui/material/Alert';
import loginImg from "/Images/login_1.jpg";
import '../Styles/pages.css';
import { BASE_URL } from '../Services/service';
import { CircularProgress } from '@mui/material';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [alert, setAlert] = useState('');
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
    setAlert('');

    try {
      const response = await fetch(`${BASE_URL}/login`, {
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

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        setAlert(`Welcome ${data.user.name}`);
        setTimeout(() => {
         
          
            window.location.href = '/dashboard';
         
        }, 1500); // delay to show alert
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

          {/* ✅ MUI Alert for success */}
          {alert && <Alert severity="success" sx={{ mb: 2 }}>{alert}</Alert>}

          {/* ❌ MUI Alert for error */}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
  {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
</button>
            <a href="/" className='link'>Create a New Account</a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

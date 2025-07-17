import { useState } from 'react';
import '../Styles/pages.css';
import signUpImg from "/Images/sign.jpg";
import { BASE_URL } from "../Services/service";
import { Alert } from '@mui/material';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    adminKey: ''
  });

  const [alert, setAlert] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          localStorage.setItem('token', data.token);
          setAlert("Registration Successful");
          setTimeout(() => window.location.href = '/login', 1500);
        } else {
          throw new Error('Token missing in response');
        }
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="register-form-container">
        <div className="image-container">
          <img src={signUpImg} alt="Register" />
        </div>
        <div className="form-container">
          <h2 className="form_label">Register</h2>
          {error && <Alert severity="error">{error}</Alert>}
          {alert && <Alert severity="success">{alert}</Alert>}
          <form onSubmit={registerUser}>
            <div className="form-group">
              <label>Name:</label>
              <input name="name" type="text" required value={formData.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input name="email" type="email" required value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input name="password" type="password" required value={formData.password} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Role:</label>
              <select name="role" value={formData.role} onChange={handleChange} required>
                <option disabled value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
                <option value="student">Student</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            {formData.role === 'admin' && (
              <div className="form-group">
                <label>Admin Key:</label>
                <input
                  type="password"
                  name="adminKey"
                  value={formData.adminKey}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
            <a href="/login" className="link">Already have an account?</a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;

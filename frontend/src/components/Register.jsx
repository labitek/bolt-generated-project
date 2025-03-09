import React, { useState } from 'react';
    import axios from 'axios';
    import { useNavigate } from 'react-router-dom';

    function Register() {
      const [firstName, setFirstName] = useState('');
      const [lastName, setLastName] = useState('');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [role, setRole] = useState('user');
      const [error, setError] = useState('');
      const [success, setSuccess] = useState('');
      const navigate = useNavigate();

      const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
          await axios.post('/api/auth/register', {
            firstName,
            lastName,
            email,
            password,
            role,
          });
          setSuccess('Registration successful! Please login.');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } catch (err) {
          setError(err.response?.data?.message || 'Registration failed');
        }
      };

      return (
        <div className="container">
          <h2>Register</h2>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">Role:</label>
              <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="user">User</option>
                <option value="consultant">Consultant</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit">Register</button>
          </form>
        </div>
      );
    }

    export default Register;

import React, { useState } from 'react';
    import axios from 'axios';
    import { useNavigate } from 'react-router-dom';

    function Login({ onLogin }) {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');
      const navigate = useNavigate();

      const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
          const response = await axios.post('/api/auth/login', {
            email,
            password,
          });
          onLogin(response.data.token, response.data.user);
          navigate('/dashboard');
        } catch (err) {
          setError(err.response?.data?.message || 'Login failed');
        }
      };

      return (
        <div className="container">
          <h2>Login</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
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
            <button type="submit">Login</button>
          </form>
        </div>
      );
    }

    export default Login;

import React, { useState, useEffect } from 'react';
    import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
    import axios from 'axios';
    import Login from './components/Login';
    import Register from './components/Register';
    import Dashboard from './components/Dashboard';
    import Transactions from './components/Transactions';
    import Categories from './components/Categories';
    import Invoices from './components/Invoices';
    import Users from './components/Users';

    function App() {
      const [user, setUser] = useState(null);
      const [token, setToken] = useState(localStorage.getItem('token') || null);
      const [isLoading, setIsLoading] = useState(true);

      useEffect(() => {
        const fetchUser = async () => {
          if (!token) {
            setIsLoading(false);
            return;
          }

          try {
            const response = await axios.get('/api/users/me', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setUser(response.data);
          } catch (error) {
            console.error('Error fetching user:', error);
            setToken(null);
            localStorage.removeItem('token');
            setUser(null);
          } finally {
            setIsLoading(false);
          }
        };

        fetchUser();
      }, [token]);

      const handleLogin = (newToken, userData) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
        setUser(userData);
      };

      const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
        setUser(null);
      };

      if (isLoading) {
        return <div>Loading...</div>;
      }

      return (
        <Router>
          <div>
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                {user ? (
                  <>
                    <li>
                      <Link to="/dashboard">Dashboard</Link>
                    </li>
                    <li>
                      <Link to="/transactions">Transactions</Link>
                    </li>
                    <li>
                      <Link to="/categories">Categories</Link>
                    </li>
                    <li>
                      <Link to="/invoices">Invoices</Link>
                    </li>
                    {user.role === 'admin' && (
                      <li>
                        <Link to="/users">Users</Link>
                      </li>
                    )}
                    <li>
                      <button onClick={handleLogout}>Logout</button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login">Login</Link>
                    </li>
                    <li>
                      <Link to="/register">Register</Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>

            <Routes>
              <Route path="/" element={<h1>Welcome</h1>} />
              <Route
                path="/login"
                element={
                  user ? (
                    <Navigate to="/dashboard" />
                  ) : (
                    <Login onLogin={handleLogin} />
                  )
                }
              />
              <Route
                path="/register"
                element={
                  user ? (
                    <Navigate to="/dashboard" />
                  ) : (
                    <Register />
                  )
                }
              />
              <Route
                path="/dashboard"
                element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
              />
              <Route
                path="/transactions"
                element={user ? <Transactions user={user} /> : <Navigate to="/login" />}
              />
              <Route
                path="/categories"
                element={user ? <Categories user={user} /> : <Navigate to="/login" />}
              />
              <Route
                path="/invoices"
                element={user ? <Invoices user={user} /> : <Navigate to="/login" />}
              />
              <Route
                path="/users"
                element={user && user.role === 'admin' ? <Users /> : <Navigate to="/login" />}
              />
            </Routes>
          </div>
        </Router>
      );
    }

    export default App;

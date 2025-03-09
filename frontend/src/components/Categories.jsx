import React, { useState, useEffect } from 'react';
    import axios from 'axios';

    function Categories({ user }) {
      const [categories, setCategories] = useState([]);
      const [name, setName] = useState('');
      const [description, setDescription] = useState('');
      const [error, setError] = useState('');
      const [success, setSuccess] = useState('');

      useEffect(() => {
        const fetchCategories = async () => {
          try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/categories', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setCategories(response.data);
          } catch (err) {
            console.error('Error fetching categories:', err);
          }
        };

        fetchCategories();
      }, []);

      const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
          const token = localStorage.getItem('token');
          await axios.post(
            '/api/categories',
            {
              name,
              description,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setSuccess('Category added successfully!');
          setName('');
          setDescription('');
          // Refresh categories
          const response = await axios.get('/api/categories', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setCategories(response.data);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to add category');
        }
      };

      if (user.role !== 'admin') {
        return (
          <div className="container">
            <h2>Categories</h2>
            <p>You do not have permission to view this page.</p>
          </div>
        );
      }

      return (
        <div className="container">
          <h2>Categories</h2>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button type="submit">Add Category</button>
          </form>

          <h3>Category List</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    export default Categories;

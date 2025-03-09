import React, { useState, useEffect } from 'react';
    import axios from 'axios';

    function Transactions({ user }) {
      const [transactions, setTransactions] = useState([]);
      const [categories, setCategories] = useState([]);
      const [amount, setAmount] = useState('');
      const [description, setDescription] = useState('');
      const [date, setDate] = useState('');
      const [type, setType] = useState('income');
      const [categoryId, setCategoryId] = useState('');
      const [error, setError] = useState('');
      const [success, setSuccess] = useState('');

      useEffect(() => {
        const fetchTransactions = async () => {
          try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/transactions', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setTransactions(response.data);
          } catch (err) {
            console.error('Error fetching transactions:', err);
          }
        };

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

        fetchTransactions();
        fetchCategories();
      }, []);

      const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
          const token = localStorage.getItem('token');
          await axios.post(
            '/api/transactions',
            {
              amount,
              description,
              date,
              type,
              categoryId,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setSuccess('Transaction added successfully!');
          setAmount('');
          setDescription('');
          setDate('');
          setType('income');
          setCategoryId('');
          // Refresh transactions
          const response = await axios.get('/api/transactions', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setTransactions(response.data);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to add transaction');
        }
      };

      return (
        <div className="container">
          <h2>Transactions</h2>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="amount">Amount:</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
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
            <div className="form-group">
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="type">Type:</label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="categoryId">Category:</label>
              <select
                id="categoryId"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit">Add Transaction</button>
          </form>

          <h3>Transaction History</h3>
          <table>
            <thead>
              <tr>
                <th>Amount</th>
                <th>Description</th>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.amount}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.date}</td>
                  <td>{transaction.type}</td>
                  <td>{transaction.category ? transaction.category.name : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    export default Transactions;

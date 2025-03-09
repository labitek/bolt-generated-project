require('dotenv').config();
    const express = require('express');
    const cors = require('cors');
    const { sequelize } = require('./models');
    const authRoutes = require('./routes/auth');
    const userRoutes = require('./routes/user');
    const transactionRoutes = require('./routes/transaction');
    const categoryRoutes = require('./routes/category');
    const invoiceRoutes = require('./routes/invoice');

    const app = express();
    const port = process.env.PORT || 3001;

    app.use(cors());
    app.use(express.json());

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/transactions', transactionRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/invoices', invoiceRoutes);

    // Database sync and server start
    sequelize.sync()
      .then(() => {
        console.log('Database synced');
        app.listen(port, () => {
          console.log(`Server is running on port ${port}`);
        });
      })
      .catch((error) => {
        console.error('Error syncing database:', error);
      });

const express = require('express');
    const router = express.Router();
    const {
      Transaction,
      Category,
      User
    } = require('../models');
    const jwt = require('jsonwebtoken');

    // Middleware to verify JWT
    const verifyToken = (req, res, next) => {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
          if (err) {
            return res.status(403).json({
              message: 'Token is not valid'
            });
          }
          req.user = user;
          next();
        });
      } else {
        res.status(401).json({
          message: 'Authorization token required'
        });
      }
    };

    // Middleware for role-based authorization
    const authorize = (roles) => {
      return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
          return res.status(403).json({
            message: 'Unauthorized'
          });
        }
        next();
      };
    };

    // Create a new transaction
    router.post('/', verifyToken, async (req, res) => {
      try {
        const {
          amount,
          description,
          date,
          type,
          categoryId
        } = req.body;
        const userId = req.user.id;

        const newTransaction = await Transaction.create({
          amount,
          description,
          date,
          type,
          userId,
          categoryId
        });

        res.status(201).json(newTransaction);
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: 'Failed to create transaction',
          error: error.message
        });
      }
    });

    // Get all transactions for a user
    router.get('/', verifyToken, async (req, res) => {
      try {
        const userId = req.user.id;
        const transactions = await Transaction.findAll({
          where: {
            userId
          },
          include: [{
            model: Category,
            as: 'category'
          }]
        });
        res.json(transactions);
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: 'Failed to retrieve transactions',
          error: error.message
        });
      }
    });

    // Get a specific transaction by ID
    router.get('/:id', verifyToken, async (req, res) => {
      try {
        const transactionId = parseInt(req.params.id, 10);
        if (isNaN(transactionId)) {
          return res.status(400).json({
            message: 'Invalid transaction ID'
          });
        }
        const transaction = await Transaction.findByPk(transactionId, {
          include: [{
            model: Category,
            as: 'category'
          }]
        });
        if (!transaction) {
          return res.status(404).json({
            message: 'Transaction not found'
          });
        }
        if (transaction.userId !== req.user.id && req.user.role !== 'admin') {
          return res.status(403).json({
            message: 'Unauthorized to access this transaction'
          });
        }
        res.json(transaction);
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: 'Failed to retrieve transaction',
          error: error.message
        });
      }
    });

    // Update a transaction
    router.put('/:id', verifyToken, async (req, res) => {
      try {
        const transactionId = parseInt(req.params.id, 10);
        if (isNaN(transactionId)) {
          return res.status(400).json({
            message: 'Invalid transaction ID'
          });
        }
        const {
          amount,
          description,
          date,
          type,
          categoryId
        } = req.body;
        const transaction = await Transaction.findByPk(transactionId);
        if (!transaction) {
          return res.status(404).json({
            message: 'Transaction not found'
          });
        }
        if (transaction.userId !== req.user.id && req.user.role !== 'admin') {
          return res.status(403).json({
            message: 'Unauthorized to update this transaction'
          });
        }
        await transaction.update({
          amount,
          description,
          date,
          type,
          categoryId
        });
        res.json(transaction);
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: 'Failed to update transaction',
          error: error.message
        });
      }
    });

    // Delete a transaction
    router.delete('/:id', verifyToken, async (req, res) => {
      try {
        const transactionId = parseInt(req.params.id, 10);
        if (isNaN(transactionId)) {
          return res.status(400).json({
            message: 'Invalid transaction ID'
          });
        }
        const transaction = await Transaction.findByPk(transactionId);
        if (!transaction) {
          return res.status(404).json({
            message: 'Transaction not found'
          });
        }
        if (transaction.userId !== req.user.id && req.user.role !== 'admin') {
          return res.status(403).json({
            message: 'Unauthorized to delete this transaction'
          });
        }
        await transaction.destroy();
        res.status(204).send();
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: 'Failed to delete transaction',
          error: error.message
        });
      }
    });

    module.exports = router;

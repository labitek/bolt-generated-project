const express = require('express');
    const router = express.Router();
    const {
      Invoice,
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

    // Create a new invoice
    router.post('/', verifyToken, async (req, res) => {
      try {
        const {
          invoiceNumber,
          issueDate,
          dueDate,
          amount,
          status,
          clientName,
          clientAddress,
          items
        } = req.body;
        const userId = req.user.id;

        const newInvoice = await Invoice.create({
          invoiceNumber,
          issueDate,
          dueDate,
          amount,
          status,
          userId,
          clientName,
          clientAddress,
          items
        });

        res.status(201).json(newInvoice);
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: 'Failed to create invoice',
          error: error.message
        });
      }
    });

    // Get all invoices for a user
    router.get('/', verifyToken, async (req, res) => {
      try {
        const userId = req.user.id;
        const invoices = await Invoice.findAll({
          where: {
            userId
          }
        });
        res.json(invoices);
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: 'Failed to retrieve invoices',
          error: error.message
        });
      }
    });

    // Get a specific invoice by ID
    router.get('/:id', verifyToken, async (req, res) => {
      try {
        const invoiceId = parseInt(req.params.id, 10);
        if (isNaN(invoiceId)) {
          return res.status(400).json({
            message: 'Invalid invoice ID'
          });
        }
        const invoice = await Invoice.findByPk(invoiceId);
        if (!invoice) {
          return res.status(404).json({
            message: 'Invoice not found'
          });```html
          }
        if (invoice.userId !== req.user.id && req.user.role !== 'admin') {
          return res.status(403).json({
            message: 'Unauthorized to access this invoice'
          });
        }
        res.json(invoice);
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: 'Failed to retrieve invoice',
          error: error.message
        });
      }
    });

    // Update an invoice
    router.put('/:id', verifyToken, async (req, res) => {
      try {
        const invoiceId = parseInt(req.params.id, 10);
        if (isNaN(invoiceId)) {
          return res.status(400).json({
            message: 'Invalid invoice ID'
          });
        }
        const {
          invoiceNumber,
          issueDate,
          dueDate,
          amount,
          status,
          clientName,
          clientAddress,
          items
        } = req.body;
        const invoice = await Invoice.findByPk(invoiceId);
        if (!invoice) {
          return res.status(404).json({
            message: 'Invoice not found'
          });
        }
        if (invoice.userId !== req.user.id && req.user.role !== 'admin') {
          return res.status(403).json({
            message: 'Unauthorized to update this invoice'
          });
        }
        await invoice.update({
          invoiceNumber,
          issueDate,
          dueDate,
          amount,
          status,
          clientName,
          clientAddress,
          items
        });
        res.json(invoice);
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: 'Failed to update invoice',
          error: error.message
        });
      }
    });

    // Delete an invoice
    router.delete('/:id', verifyToken, async (req, res) => {
      try {
        const invoiceId = parseInt(req.params.id, 10);
        if (isNaN(invoiceId)) {
          return res.status(400).json({
            message: 'Invalid invoice ID'
          });
        }
        const invoice = await Invoice.findByPk(invoiceId);
        if (!invoice) {
          return res.status(404).json({
            message: 'Invoice not found'
          });
        }
        if (invoice.userId !== req.user.id && req.user.role !== 'admin') {
          return res.status(403).json({
            message: 'Unauthorized to delete this invoice'
          });
        }
        await invoice.destroy();
        res.status(204).send();
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: 'Failed to delete invoice',
          error: error.message
        });
      }
    });

    module.exports = router;

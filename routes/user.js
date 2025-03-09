const express = require('express');
    const router = express.Router();
    const {
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

    // Get all users (Admin only)
    router.get('/', verifyToken, authorize(['admin']), async (req, res) => {
      try {
        const users = await User.findAll({
          attributes: {
            exclude: ['password']
          }
        });
        res.json(users);
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: 'Failed to retrieve users',
          error: error.message
        });
      }
    });

    // Get a specific user (Admin or self)
    router.get('/:id', verifyToken, async (req, res) => {
      try {
        const userId = parseInt(req.params.id, 10);
        if (isNaN(userId)) {
          return res.status(400).json({
            message: 'Invalid user ID'
          });
        }
        const user = await User.findByPk(userId, {
          attributes: {
            exclude: ['password']
          }
        });
        if (!user) {
          return res.status(404).json({
            message: 'User not found'
          });
        }
        if (req.user.role !== 'admin' && req.user.id !== user.id) {
          return res.status(403).json({
            message: 'Unauthorized to access this user'
          });
        }
        res.json(user);
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: 'Failed to retrieve user',
          error: error.message
        });
      }
    });

    module.exports = router;

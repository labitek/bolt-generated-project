const express = require('express');
    const router = express.Router();
    const {
      User
    } = require('../models');
    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcryptjs');

    router.post('/register', async (req, res) => {
      try {
        const {
          firstName,
          lastName,
          email,
          password,
          role
        } = req.body;
        const userExists = await User.findOne({
          where: {
            email
          }
        });
        if (userExists) {
          return res.status(400).json({
            message: 'User already exists'
          });
        }
        const newUser = await User.create({
          firstName,
          lastName,
          email,
          password,
          role
        });
        res.status(201).json({
          message: 'User registered successfully'
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: 'Registration failed',
          error: error.message
        });
      }
    });

    router.post('/login', async (req, res) => {
      try {
        const {
          email,
          password
        } = req.body;
        const user = await User.findOne({
          where: {
            email
          }
        });
        if (!user) {
          return res.status(400).json({
            message: 'Invalid credentials'
          });
        }
        const validPassword = await user.validPassword(password);
        if (!validPassword) {
          return res.status(400).json({
            message: 'Invalid credentials'
          });
        }
        const token = jwt.sign({
          id: user.id,
          email: user.email,
          role: user.role
        }, process.env.JWT_SECRET, {
          expiresIn: '1h'
        });
        res.json({
          token,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
          }
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: 'Login failed',
          error: error.message
        });
      }
    });

    module.exports = router;

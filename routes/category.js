const express = require('express');
    const router = express.Router();
    const {
      Category
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

    // Create a new category (Admin only)
    router.post('/', verifyToken, authorize(['admin']), async (req, res) => {
      try {
        const {
          name,
          description
        } = req.body;
        const newCategory = await Category.create({
          name,
          description
        });
        res.status(201).json(newCategory);
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: 'Failed to create category',
          error: error.message
        });
      }
    });

    // Get all categories
    router.get('/', verifyToken, async (req, res) => {
      try {
        const categories = await Category.findAll();
        res.json(categories);
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: 'Failed to retrieve categories',
          error: error.message
        });
      }
    });

    // Get a specific category by ID
    router.get('/:id', verifyToken, async (req, res) => {
      try {
        const categoryId = parseInt(req.params.id, 10);
        if (isNaN(categoryId)) {
          return res.status(400).json({
            message: 'Invalid category ID'
          });
        }
        const category = await Category.findByPk(categoryId);
        if (!category) {
          return res.status(404).json({
            message: 'Category not found'
          });
        }
        res.json(category);
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: 'Failed to retrieve category',
          error: error.message
        });
      }
    });

    // Update a category (Admin only)
    router.put('/:id', verifyToken, authorize(['admin']), async (req, res) => {
      try {
        const categoryId = parseInt(req.params.id, 10);
        if (isNaN(categoryId)) {
          return res.status(400).json({
            message: 'Invalid category ID'
          });
        }
        const {
          name,
          description
        } = req.body;
        const category = await Category.findByPk(categoryId);
        if (!category) {
          return res.status(404).json({
            message: 'Category not found'
          });
        }
        await category.update({
          name,
          description
        });
        res.json(category);
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: 'Failed to update category',
          error: error.message
        });
      }
    });

    // Delete a category (Admin only)
    router.delete('/:id', verifyToken, authorize(['admin']), async (req, res) => {
      try {
        const categoryId = parseInt(req.params.id, 10);
        if (isNaN(categoryId)) {
          return res.status(400).json({
            message: 'Invalid category ID'
          });
        }
        const category = await Category.findByPk(categoryId);
        if (!category) {
          return res.status(404).json({
            message: 'Category not found'
          });
        }
        await category.destroy();
        res.status(204).send();
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: 'Failed to delete category',
          error: error.message
        });
      }
    });

    module.exports = router;

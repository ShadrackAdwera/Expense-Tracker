const express = require('express');
const { check } = require('express-validator');
const checkAuth = require('../middlewares/auth-middleware')

const categoriesController = require('../controllers/category-controllers');

const router = express.Router();

router.get('/all', categoriesController.getAllCategories);

router.get('/:id', categoriesController.getCategoryById);

router.use(checkAuth) 

router.post(
  '/new',
  [check('name').not().isEmpty(), check('description').isLength({ min: 6 })],
  categoriesController.createCategory
);

router.patch('/:id', categoriesController.updateCategory)

router.delete('/:id',categoriesController.deleteCategory)

module.exports = router

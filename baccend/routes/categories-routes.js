const express = require('express');
const { check } = require('express-validator');
//const checkAuth = require('../middlewares/auth-middleware')

const categoriesController = require('../controllers/category-controllers');

const router = express.Router();

//router.use(checkAuth)

router.get('/all', categoriesController.getAllCategories);

router.get('/:id', categoriesController.getCategoryById);

router.post(
  '/new',
  [check('name').not().isEmpty(), check('description').isLength({ min: 6 })],
  categoriesController.createCategory
);

router.patch('/:id', categoriesController.getCategoryById)

router.delete('/:id',categoriesController.deleteCategory)

module.exports = router

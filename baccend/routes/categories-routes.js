const express = require('express');
const { check } = require('express-validator');
const checkAuth = require('../middlewares/auth-middleware')

const categoriesController = require('../controllers/category-controllers');

const router = express.Router();

router.get('/all', categoriesController.getAllCategories);

router.get('/:id', categoriesController.getCategoryById);

router.get('/user/:userId', categoriesController.getCategoriesByUser);

router.use(checkAuth) 

router.post(
  '/new',
  [check('name').not().isEmpty(), check('description').isLength({ min: 6 }), check('user').not().isEmpty()],
  categoriesController.createCategory
);

router.patch('/:id', categoriesController.updateCategory)

router.delete('/:id',categoriesController.deleteCategory)

module.exports = router

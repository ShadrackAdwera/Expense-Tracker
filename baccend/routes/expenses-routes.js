const express = require('express');
const { check } = require('express-validator');

const expensesController = require('../controllers/expenses-controllers');
const imageUpload = require('../middlewares/image-upload')

const router = express.Router();

router.get('/all', expensesController.getAllExpenses);
router.get('/:id', expensesController.getExpenseById);
router.get('/user/:id',expensesController.getExpensesByUser)
router.post(
  '/new',
  imageUpload.single('image'),
  [
    check('name').not().isEmpty(),
    check('description').not().isEmpty(),
    check('price').isNumeric(),
  ],
  expensesController.addExpense
);
router.patch('/:id', expensesController.updateExpense);
router.delete('/:id', expensesController.deleteExpense);

module.exports = router

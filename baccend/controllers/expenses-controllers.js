const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');
const moment = require('moment');

const HttpError = require('../models/http-error');

let DUMMY_EXPENSES = [
  {
    id: uuid(),
    name: 'Morning Expense',
    description:
      'Bought Nyama, Ngwashe, Ndizi, Unga, Mboga, Nyanya, Kitunguu, Pili Pili',
    price: 1000,
    receipt:
      'https://i.pinimg.com/originals/75/52/ca/7552ca31d6707a32d67ae0fea789ac44.jpg',
    date: moment(new Date()).format('MMMM Do YYYY, hh:mm'),
    category: uuid(),
    user: 1,
  },
  {
    id: uuid(),
    name: 'Afternoon Expense',
    description: 'Ordered Pizza Off of Jumia',
    price: 1200,
    receipt:
      'https://i.pinimg.com/originals/75/52/ca/7552ca31d6707a32d67ae0fea789ac44.jpg',
    date: moment(new Date()).format('MMMM Do YYYY, hh:mm'),
    category: uuid(),
    user: 2,
  },
  {
    id: uuid(),
    name: 'Night Expense',
    description: 'Enjoyed Nyama Choma and Drinks with friends',
    price: 1500,
    receipt:
      'https://i.pinimg.com/originals/75/52/ca/7552ca31d6707a32d67ae0fea789ac44.jpg',
    date: moment(new Date()).format('MMMM Do YYYY, hh:mm'),
    category: uuid(),
    user: 1,
  },
];

//CREATE
const addExpense = (req, res, next) => {
  const { name, description, price } = req.body;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError('Provide all fields', 422));
  }
  const createdExpense = {
    id: uuid(),
    name,
    description,
    price,
    receipt: req.file.path,
    date: moment(new Date()).format('MMMM Do YYYY, hh:mm'),
    category: uuid(),
  };
  DUMMY_EXPENSES.unshift(createdExpense);
  res.status(201).json({ message: 'Expense Added', expense: createdExpense });
};

//READ
const getAllExpenses = (req, res, next) => {
  res
    .status(200)
    .json({ totalExpenses: DUMMY_EXPENSES.length, expenses: DUMMY_EXPENSES });
};

const getExpensesByUser = (req, res, next) => {
  const userId = req.params.id;
  const foundUser = DUMMY_EXPENSES.find((exp) => exp.user === userId);
  if (!foundUser) {
    return next(new HttpError('User does not exist', 404));
  }
  const foundExpenses = DUMMY_EXPENSES.filter((exp) => exp.user === userId);
  res
    .status(200)
    .json({ totalExpenses: DUMMY_EXPENSES.length, expenses: foundExpenses });
};

const getExpenseById = (req, res, next) => {
  const expenseId = req.params.id;
  const foundExpense = DUMMY_EXPENSES.find(
    (expense) => expense.id === expenseId
  );
  if (!foundExpense) {
    return next(new HttpError('Expense does not exist', 404));
  }
  res.status(200).json({ expense: foundExpense });
};

//UPDATE
const updateExpense = (req, res, next) => {
  const expenseId = req.params.id;
  const { name, description, price, date } = req.body;
  const foundExpense = DUMMY_EXPENSES.find(
    (expense) => expense.id === expenseId
  );
  const expenseIndex = DUMMY_EXPENSES.findIndex(
    (expense) => expense.id === expenseId
  );
  if (!foundExpense) {
    return next(new HttpError('Expense does not exist', 404));
  }
  foundExpense.name = name;
  foundExpense.description = description;
  foundExpense.price = price;
  foundExpense.date = date;
  DUMMY_EXPENSES[expenseIndex] = foundExpense;
  res.status(200).json({ message: 'Updated!', expense: foundExpense });
};

const deleteExpense = (req, res, next) => {
  const expenseId = req.params.id;
  const foundExpense = DUMMY_EXPENSES.find(
    (expense) => expense.id === expenseId
  );
  if (!foundExpense) {
    return next(new HttpError('Expense does not exist', 404));
  }
  DUMMY_EXPENSES = DUMMY_EXPENSES.filter((expense) => expense.id !== expenseId);
  res.status(200).json({ message: 'Deleted!' });
};

exports.getAllExpenses = getAllExpenses;
exports.getExpenseById = getExpenseById;
exports.getExpensesByUser = getExpensesByUser;
exports.addExpense = addExpense;
exports.updateExpense = updateExpense;
exports.deleteExpense = deleteExpense;

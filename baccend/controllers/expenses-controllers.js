const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const moment = require('moment');
const Expense = require('../models/Expense');

const HttpError = require('../models/http-error');
const User = require('../models/User');

// let DUMMY_EXPENSES = [
//   {
//     id: uuid(),
//     name: 'Morning Expense',
//     description:
//       'Bought Nyama, Ngwashe, Ndizi, Unga, Mboga, Nyanya, Kitunguu, Pili Pili',
//     price: 1000,
//     image:
//       'https://i.pinimg.com/originals/75/52/ca/7552ca31d6707a32d67ae0fea789ac44.jpg',
//     date: moment(new Date()).format('MMMM Do YYYY, hh:mm'),
//     category: uuid(),
//     user: 1,
//   },
//   {
//     id: uuid(),
//     name: 'Afternoon Expense',
//     description: 'Ordered Pizza Off of Jumia',
//     price: 1200,
//     image:
//       'https://i.pinimg.com/originals/75/52/ca/7552ca31d6707a32d67ae0fea789ac44.jpg',
//     date: moment(new Date()).format('MMMM Do YYYY, hh:mm'),
//     category: uuid(),
//     user: 2,
//   },
//   {
//     id: uuid(),
//     name: 'Night Expense',
//     description: 'Enjoyed Nyama Choma and Drinks with friends',
//     price: 1500,
//     image:
//       'https://i.pinimg.com/originals/75/52/ca/7552ca31d6707a32d67ae0fea789ac44.jpg',
//     date: moment(new Date()).format('MMMM Do YYYY, hh:mm'),
//     category: uuid(),
//     user: 1,
//   },
// ];

//CREATE
const addExpense = async (req, res, next) => {
  const { name, description, date, price, category, user } = req.body;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError('Provide all fields', 422));
  }
  let foundUser;

  try {
    foundUser = await User.findById(user);
  } catch (error) {
    return next(new HttpError('Could not search for users', 500));
  }

  if (!foundUser) {
    return next(new HttpError('User does not exist', 422));
  }

  const expe = {
    name,
    description,
    date,
    image:
      'https://i.pinimg.com/originals/75/52/ca/7552ca31d6707a32d67ae0fea789ac44.jpg',
    price,
    category,
    user,
    dateCreated: moment(new Date()).format('MMMM Do YYYY, hh:mm'),
  };
  const createdExpense = new Expense(expe);
  try {
    const sessn = await mongoose.startSession();
    sessn.startTransaction();
    await createdExpense.save({ session: sessn });
    foundUser.expenses.push(createdExpense);
    await foundUser.save({ session: sessn });
    await sessn.commitTransaction();
  } catch (error) {
    return next(new HttpError('Could not add expense', 500));
  }
  res.status(201).json({
    message: 'Expense Added',
    expense: createdExpense.toObject({ getters: true }),
  });
};

//READ
const getAllExpenses = async (req, res, next) => {
  let allExpenses;
  try {
    allExpenses = await Expense.find().exec();
  } catch (error) {
    return next(new HttpError('Could not fetch expenses', 500));
  }
  res.status(200).json({
    totalExpenses: allExpenses.length,
    expenses: allExpenses.map((expe) => expe.toObject({ getters: true })),
  });
};

const getExpensesByUser = async (req, res, next) => {
  const userId = req.params.id;
  let userExpenses;

  try {
    userExpenses = await Expense.find({ user: userId }).exec();
  } catch (error) {
    return next(new HttpError('Could not fetch user', 500));
  }
  if (!userExpenses || userExpenses.length < 1) {
    return next(
      new HttpError('Could not find expenses for the provided user', 404)
    );
  }
  res.status(200).json({
    totalExpenses: userExpenses.length,
    expenses: userExpenses.map((exp) => exp.toObject({ getters: true })),
  });
};

const getExpenseById = async (req, res, next) => {
  const expenseId = req.params.id;
  let foundExpense;
  try {
    foundExpense = await Expense.findById(expenseId).exec();
  } catch (error) {
    return next(new HttpError('Could not fetch expense', 500));
  }
  if (!foundExpense) {
    return next(new HttpError('Expense does not exist', 404));
  }
  res.status(200).json({ expense: foundExpense.toObject({ getters: true }) });
};

//UPDATE
const updateExpense = async (req, res, next) => {
  const expenseId = req.params.id;
  const { name, description, price, date, category } = req.body;

  let foundExpense;

  try {
    foundExpense = await Expense.findById(expenseId);
  } catch (error) {
    return next(new HttpError('Could not fetch expense', 500));
  }

  if (!foundExpense) {
    return next(new HttpError('Expense does not exist', 404));
  }
  foundExpense.name = name;
  foundExpense.description = description;
  foundExpense.price = price;
  foundExpense.date = date;
  foundExpense.category = category;

  try {
    await foundExpense.save();
  } catch (error) {
    return next(new HttpError('Could not save expense', 500));
  }

  res.status(200).json({
    message: 'Updated!',
    expense: foundExpense.toObject({ getters: true }),
  });
};

const deleteExpense = async (req, res, next) => {
  const expenseId = req.params.id;
  let foundExpense;

  try {
    foundExpense = await Expense.findById(expenseId).populate('user');
  } catch (error) {
    return next(new HttpError('Could not fetch expense', 500));
  }
  if (!foundExpense) {
    return next(new HttpError('Expense does not exist', 404));
  }
  try {
    const sessn = await mongoose.startSession()
    sessn.startTransaction()
    await Expense.remove(foundExpense);
    foundExpense.user.expenses.pull(foundExpense)
    await foundExpense.user.save({session: sessn})
    await sessn.commitTransaction()
  } catch (error) {
    return next(new HttpError('Could not delete expense', 500));
  }
  res.status(200).json({ message: 'Deleted!' });
};

exports.getAllExpenses = getAllExpenses;
exports.getExpenseById = getExpenseById;
exports.getExpensesByUser = getExpensesByUser;
exports.addExpense = addExpense;
exports.updateExpense = updateExpense;
exports.deleteExpense = deleteExpense;

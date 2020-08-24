const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Category = require('../models/Category');
const User = require('../models/User');

//CREATE
const createCategory = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError('Provide all the required fields', 422));
  }
  const { name, description, user } = req.body;

  let foundUser;

  try {
    foundUser = await User.findById(user).exec();
  } catch (error) {
    return next(new HttpError('COuld not search for users', 500));
  }

  if (!foundUser) {
    return next(new HttpError('User does not exist', 404));
  }

  const newCategory = {
    name,
    description,
    expenses: [],
    user,
  };

  const cat = new Category(newCategory);
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await cat.save({ session: sess });
    foundUser.categories.push(cat);
    await foundUser.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return next(new HttpError('Could not create category', 500));
  }
  res
    .status(201)
    .json({ message: 'Created', category: cat.toObject({ getters: true }) });
};

//READ
const getAllCategories = async (req, res, next) => {
  let allCategories;

  try {
    allCategories = await Category.find();
  } catch (error) {
    return next(new HttpError('Could not fetch categories', 500));
  }

  res.status(200).json({
    totalCategories: allCategories.length,
    categories: allCategories.map((category) =>
      category.toObject({ getters: true })
    ),
  });
};

const getCategoryById = async (req, res, next) => {
  const categoryId = req.params.id;
  let foundCategory;
  try {
    foundCategory = Category.findById(categoryId);
  } catch (error) {
    return next(new HttpError('Could not find category', 500));
  }
  if (!foundCategory) {
    return next(new HttpError('Category does not exist', 404));
  }
  res
    .status(200)
    .json({ category: (await foundCategory).toObject({ getters: true }) });
};

const getCategoriesByUser = async (req, res, next) => {
  const userId = req.params.userId;
  let foundUser;

  try {
    foundUser = await User.findById(userId).exec();
  } catch (error) {
    return next(new HttpError('COuld not search for users', 500));
  }

  if (!foundUser) {
    return next(new HttpError('User does not exist', 404));
  }

  let categories;
  try {
    categories = await Category.find({ user: userId }).exec();
  } catch (error) {
    return next(new HttpError('Could not find categories', 404));
  }
  if (!categories || categories.length < 1) {
    return next(new HttpError('Could not find categories', 404));
  }
  res
    .status(200)
    .json({
      totalCategories: categories.length,
      categories: categories.map((category) =>
        category.toObject({ getters: true })
      ),
    });
};

//UPDATE
const updateCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  const { name, description } = req.body;
  let foundCategory;
  try {
    foundCategory = await Category.findById(categoryId);
  } catch (error) {
    return next(new HttpError('Could not find category', 500));
  }
  if (!foundCategory) {
    return next(new HttpError('Category does not exist', 404));
  }

  if(foundCategory.user !== req.userData.userId) {
    return next(new HttpError('You are not authorized to perform this operation', 401));
  }

  foundCategory.name = name;
  foundCategory.description = description;
  try {
    await foundCategory.save();
  } catch (error) {
    return next(new HttpError('Update failed!', 500));
  }

  res.status(200).json({
    message: 'Category Updated',
    category: foundCategory.toObject({ getters: true }),
  });
};

//DELETE
const deleteCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  let foundCategory;
  try {
    foundCategory = await Category.findById(categoryId).populate('user');
  } catch (error) {
    return next(new HttpError('Could not find category', 500));
  }
  if (!foundCategory) {
    return next(new HttpError('Category does not exist', 404));
  }

  if(foundCategory.user !== req.userData.userId) {
    return next(new HttpError('You are not authorized to perform this operation', 401));
  }

  try {
    const sessn = await mongoose.startSession()
    sessn.startTransaction()
    await foundCategory.remove()
    foundCategory.user.categories.pull(foundCategory)
    await foundCategory.save({session: sessn})
    await foundCategory.user.categories.save({session: sessn})
    await sessn.commitTransaction()
  } catch (error) {
    
  }
  res.status(200).json({ message: 'Category deleted!' });
};

exports.createCategory = createCategory;
exports.getAllCategories = getAllCategories;
exports.getCategoryById = getCategoryById;
exports.getCategoriesByUser = getCategoriesByUser
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;

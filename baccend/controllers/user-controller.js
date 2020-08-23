const { v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');

let DUMMY_USERS = [
  {
    id: uuid(),
    name: 'Test Subject One',
    email: 'testone@mail.com',
    password: 'qazwsx',
  },
  {
    id: uuid(),
    name: 'Test Subject Two',
    password: 'xswzaq',
  },
];

//ALL USERS
const getAllUsers = (req,res,next) => {
    res.status(200).json({totalUsers: DUMMY_USERS.length, users: DUMMY_USERS})
}

//SIGN UP
const signUp = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError('Sign Up failed, check your inputs', 422));
  }
  const { name, email, password } = req.body;
  const foundEmail = DUMMY_USERS.find((user) => user.email === email);

  if (foundEmail) {
    return next(new HttpError('Email exists, try logging in', 422));
  }
  let encryptedPassword;
  let token;

  try {
    encryptedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError('Auth failed', 401));
  }

  try {
    token = jwt.sign({ email, password }, 'fucc_them_kids', {
      expiresIn: '1h',
    });
  } catch (error) {
    return next(new HttpError('Auth failed', 401));
  }

  const createUser = {
    id: uuid(),
    name,
    email,
    password: encryptedPassword,
    token,
  };
  DUMMY_USERS.unshift(createUser);

  res
    .status(201)
    .json({
      message: 'Sign Up Successful',
      user: { name, email, token },
    });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const foundEmail = DUMMY_USERS.find((user) => user.email === email);

  if (!foundEmail) {
    return next(new HttpError('Email does not exist', 401));
  }

  let isPassword;
  let token;

  try {
    isPassword = await bcrypt.compare(password, foundEmail.password);
  } catch (error) {
    return next(new HttpError('Auth Failed-->', 401));
  }

  if (!isPassword) {
    return next(new HttpError('Invalid password', 401));
  }

  try {
    token = jwt.sign({ email, password }, 'fucc_them_kids', {
      expiresIn: '1h',
    });
  } catch (error) {
    return next(new HttpError('Could not generate token', 500));
  }

  res
    .status(200)
    .json({ message: 'Logged In', user: { id: foundEmail.id, name: foundEmail.name ,email, token } });
};

exports.signUp = signUp;
exports.login = login;
exports.getAllUsers = getAllUsers

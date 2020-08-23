const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const User = require('../models/User')

// let DUMMY_USERS = [
//   {
//     id: uuid(),
//     name: 'Test Subject One',
//     email: 'testone@mail.com',
//     password: 'qazwsx',
//   },
//   {
//     id: uuid(),
//     name: 'Test Subject Two',
//     password: 'xswzaq',
//   },
// ];

//ALL USERS
const getAllUsers = async (req,res,next) => {
    let allUsers
    try {
      allUsers = await User.find({},'-password').exec()
    } catch (error) {
      return next(new HttpError('COuld not fetch users', 500));
    }
    res.status(200).json({totalUsers: allUsers.length, users: allUsers.map(user=>user.toObject({getters:true}))})
}

//SIGN UP
const signUp = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError('Sign Up failed, check your inputs', 422));
  }
  const { name, email, password } = req.body;

  let foundEmail

  try {
    foundEmail = await User.findOne({email}).exec()
  } catch (error) {
    return next(new HttpError('Could not search DB for emails', 500));
  }


  if (foundEmail) {
    return next(new HttpError('Email exists, try logging in', 422));
  }
  let encryptedPassword;
  let token;

  try {
    encryptedPassword = await bcrypt.hash(password, 12)
  } catch (error) {
    return next(new HttpError('Could not hash password', 500));
  }

  const createUser = {
    name,
    email,
    password: encryptedPassword,
    //expenses: ''
  };

  const signedUpUser = new User(createUser)
  try {
    await signedUpUser.save()
  } catch (error) {
    return next(new HttpError('Could not save user', 500));
  }

  try {
    token = jwt.sign({userId: createUser.id, email: createUser.email}, process.env.JWT_KEY,{expiresIn:'1h'})
  } catch (error) {
    return next(new HttpError('Could not generate tokens', 500));
  }
  res
    .status(201)
    .json({
      message: 'Sign Up Successful',
      user: { id: signedUpUser.id ,name, email, token },
    });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let foundEmail

  try {
    foundEmail = await User.findOne({email})
  } catch (error) {
    return next(new HttpError('Could not search for email', 500));
  }

  if (!foundEmail) {
    return next(new HttpError('Email does not exist', 422));
  }

  let isPassword;
  let token;

  try {
    isPassword = await bcrypt.compare(password, foundEmail.password)
  } catch (error) {
    return next(new HttpError('Password compare failed', 401));
  }

  if(!isPassword) {
    return next(new HttpError('Invalid password', 422));
  }

  try {
    token = jwt.sign({userId: foundEmail.id, email: foundEmail.email}, process.env.JWT_KEY, {expiresIn: '1h'})
  } catch (error) { 
  }

  res
    .status(200)
    .json({ message: 'Logged In', user: { id: foundEmail.id, name: foundEmail.name ,email, token } });
};

exports.signUp = signUp;
exports.login = login;
exports.getAllUsers = getAllUsers

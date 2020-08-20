const express = require('express');
const { check } = require('express-validator');

const userControllers = require('../controllers/user-controller');

const app = express();

app.post(
  '/sign-up',
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  userControllers.signUp
);

app.post('login', userControllers.login);

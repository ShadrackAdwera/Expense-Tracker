const express = require('express');
const { check } = require('express-validator');

const userControllers = require('../controllers/user-controller');

const router = express.Router();

router.get('/all', userControllers.getAllUsers)

router.post(
  '/sign-up',
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  userControllers.signUp
);

router.post('/login', userControllers.login);

module.exports = router
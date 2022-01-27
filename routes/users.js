const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user.js');
const catchAsync = require('../utilities/catchAsync')
const users = require('../controllers/users.js');

router.route('/register')
    .get(catchAsync(users.registerForm))
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), users.login);

router.get('/logout', users.logout);

module.exports = router
//the auto_encrypter is stored on the session
const express = require('express')
const router = express.Router();
const passport = require('passport');
const {saveRedirectUser} = require('../middleware')
const usersController = require('../controller/users')


router.get('/signUp', usersController.renderSignUpForm)
router.post('/signUp', usersController.signUpUser)

router.get('/login', usersController.renderLoginForm)
router.post('/login', saveRedirectUser, passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}), usersController.afterUserLogin)

router.get('/logOut', usersController.logOutUser)

module.exports = router;



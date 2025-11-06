const express = require('express')
const router = express.Router();
const passport = require('passport');
const {saveRedirectUser} = require('../middleware')
const usersController = require('../controller/users')


router
    .route('/signUp')
    .get( usersController.renderSignUpForm)
    .post( usersController.signUpUser)

router
    .route('/login')
    .get( usersController.renderLoginForm)
    .post( saveRedirectUser, passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}), usersController.afterUserLogin)

router.get('/logOut', usersController.logOutUser)

module.exports = router;



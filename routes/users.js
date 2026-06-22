const express = require('express')
const router = express.Router();
const passport = require('passport');
const {saveRedirectUser} = require('../middleware')
const usersController = require('../controller/users')

//yaad rakho tum server ka code likh rahe ho, to jab server ke paas login karne ke lie request aayegi to server pehle passport ko bolega
//passport.authenticate('local','...') ki passport bhaiya, zara ye user jo username aur password de raha hai in credentials ko authenticate karo zara local strategy se
//aue ye index.js me root server code ko refer karte hue User.authenticate() ko call karta hai.
//User.authenticate() ye cheez User model ko passport local mongoose se mila tha. Ye User model ko refer karte hue user ke login ko authenticate karta hai
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



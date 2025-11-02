const express = require('express')
const router = express.Router();
const User = require('../models/user');
const passport = require('passport')



router.get('/signUp',(req,res)=>{
    res.render('users/signUp.ejs');
})

router.post('/signUp', async(req,res)=>{
    try{const {username,email,password} = req.body;
    const user = new User({username:username, email:email});
    await User.register(user,password);
    req.flash('success','User registration successful.')
    res.redirect('/listings');
    }catch(e){
        req.flash('error','The username is already taken.');
        return res.redirect('/signUp');
    }
})



router.get('/login',(req,res)=>{
    res.render('users/login.ejs');
})
router.post('/login', passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),(req,res)=>{
    req.flash('success',"Login successful");
    res.redirect('/listings');
})

router.get('/logOut',(req,res)=>{
    req.logOut((err)=>{
        if(err){
             return next(err);
        }
        req.flash('success',"User logOut successful.");
        res.redirect('/listings');
    })
})

module.exports = router;



const express = require('express')
const router = express.Router();
const User = require('../models/user');



router.get('/signUp',(req,res)=>{
    res.render('users/signUp.ejs');
})

router.post('/signUp', async(req,res)=>{
    const {username,email,password} = req.body;
    const exist = await User.findOne({username:username})
    if(exist){
        req.flash('error','The username is already taken.');
        return res.redirect('/signUp');
    }
    const user = new User({username:username, email:email});
    await User.register(user,password);
    req.flash('success','User registration successful.')
    res.redirect('/listings');
})

module.exports = router;



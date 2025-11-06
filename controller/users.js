const User = require('../models/user');

module.exports.renderSignUpForm = (req,res)=>{
    res.render('users/signUp.ejs');
}

module.exports.signUpUser = async(req,res)=>{
    try{const {username,email,password} = req.body;
    const user = new User({username:username, email:email});
    const registeredUser = await User.register(user,password);
    req.login(registeredUser,((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success','User registration successful.')
        res.redirect('/listings');
    }))
    }catch(e){
        req.flash('error','The username is already taken.');
        return res.redirect('/signUp');
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render('users/login.ejs');
}

module.exports.afterUserLogin = (req,res)=>{
    req.flash('success',"Login successful");
    const redirect = res.locals.redirectUser || '/listings'
    res.redirect(redirect);
}

module.exports.logOutUser = (req,res)=>{
    req.logOut((err)=>{
        if(err){
             return next(err);
        }
        req.flash('success',"User logOut successful.");
        res.redirect('/listings');
    })
}
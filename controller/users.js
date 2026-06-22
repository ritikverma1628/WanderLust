const User = require('../models/user');

module.exports.renderSignUpForm = (req,res)=>{
    res.render('users/signUp.ejs');
}

module.exports.signUpUser = async(req,res, next)=>{
    try{const {username,email,password} = req.body;
    const user = new User({username:username, email:email});

    // Internally register() does:
    //     Step 1 → Takes your plain password
    //     Step 2 → Hashes it (secure encryption)
    //     Step 3 → Stores:
    //     username (from user)
    //     hashed password (NOT actual password)
    //     salt (extra security)
    //     Step 4 → Saves user to DB

    const registeredUser = await User.register(user,password);
    //login() method is introduced in req object by passport 
    //req.login() user ko session me establish karta hai matlab ab user logged in hai 
    // is line se user signup karne ke baad login bhi ho jata hai , aur isi line ki wajah se tumhe user ko singup karne ke baad dubara se user ko login karane ki zaroorat nhi padti 
    req.login(registeredUser,((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success','User registration successful.')
        return res.redirect('/listings');
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

module.exports.logOutUser = (req,res, next)=>{
    req.logOut((err)=>{
        if(err){
             return next(err);
        }
        req.flash('success',"User logOut successful.");
        res.redirect('/listings');
    })
}
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        console.log(req.originalUrl);
        req.session.redirectUser = req.originalUrl;
        req.flash('error',"You are not logged in...");
        return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUser = (req,res,next)=>{
    if(req.session.redirectUser){
        res.locals.redirectUser = req.session.redirectUser;
    }
    next();
}
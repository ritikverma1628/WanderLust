const Listing = require('./models/listings/listings')


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

module.exports.isOwner = async(req,res,next)=>{
    const {id}= req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash('error',"You are not the owner of this listing.");
        return res.redirect(`/listings/${id}`)
    }
    next();
}
const Listing = require('./models/listings/listings');
const Review = require('./models/reviews');
const ExpressError = require('./utils/expressError');
const {listingValidations, reviewValidations} = require('./joiValidations');


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

module.exports.validateListing = (req,res,next)=>{
    req.body.image = 
    {
        url:req.file.path,
        fieldname:req.file.fieldname
    };
    const {error} = listingValidations.validate(req.body);
    if(error){
        throw new ExpressError(404,error)
    }
    else{next()};
}

module.exports.validateReview = (req,res,next)=>{
    const {error} = reviewValidations.validate(req.body)
    if(error){
        throw new ExpressError(404, error)
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    const {id,reviewId}=req.params;
    const review = await Review.findById(reviewId).populate('author');
    if(res.locals.currUser && review.author._id.equals(res.locals.currUser._id)){
        next();
    }
    else{
        req.flash('error',"You are no the author of this review.");
        res.redirect(`/listings/${id}`)
    }
}
const express = require('express')
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap");
const Listing = require("../models/listings/listings")
const ExpressError = require("../utils/expressError")
const {listingValidations} = require('../joiValidations')
const {isLoggedIn} = require('../middleware');


//server-side validations for listing forms
const validateListing = (req,res,next)=>{
    const {error} = listingValidations.validate(req.body);
    if(error){
        throw new ExpressError(404,error)
    }
    else{next()};
}


router.get("/", asyncWrap(async(req,res)=>{
    const listings = await Listing.find({});
    res.render("index.ejs",{listings})
}))


router.get("/new",isLoggedIn, (req,res)=>{
    res.render("new.ejs");
})
router.post("/",validateListing, asyncWrap(async(req,res, next)=>{
    const listing = req.body;
    await Listing.create(listing);
    req.flash('success',"New Listing created");
    res.redirect("/listings")
}))


router.delete("/:id",isLoggedIn,asyncWrap(async(req,res)=>{
    await Listing.findByIdAndDelete(req.params.id);
    req.flash('success',"Listing Deleted");
    res.redirect("/listings");
}))


router.get("/:id/edit",isLoggedIn,asyncWrap(async(req,res)=>{
    const listing = await Listing.findById(req.params.id);
    if(!listing){
        req.flash('error','The listing you are trying to edit does not exist');
        return res.redirect('/listings')
    }
    console.log(listing);
    res.render("edit.ejs",{listing});
}));
router.patch("/:id", validateListing , asyncWrap(async (req,res)=>{
    const newListing = req.body;
    await Listing.findByIdAndUpdate(req.params.id,newListing);
    req.flash('success',"Listing Updated");
    res.redirect("/listings");
}))


router.get("/:id",asyncWrap(async (req,res)=>{
    const id = req.params.id;
    const listing = await Listing.findById(id).populate('reviews');
    if(!listing){
        req.flash('error','The Listing you are trying to access may have been deleted');
        return res.redirect('/listings');
    }
    res.render("show.ejs",{listing})
}))


module.exports = router;
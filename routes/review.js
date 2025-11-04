const express = require('express')
const router = express.Router({mergeParams:true});
const Review = require('../models/reviews');
const Listing = require("../models/listings/listings")
const asyncWrap = require("../utils/asyncWrap");
const {isLoggedIn, validateReview} = require('../middleware');


router.post('/', isLoggedIn, validateReview, asyncWrap(async(req,res)=>{
    let review = await Review.create(req.body.review)
    const listing = await Listing.findById(req.params.id);
    listing.reviews.push(review);
    await listing.save();
    req.flash('success',"New Review Created");
    res.redirect(`/listings/${req.params.id}`)
}))

//deleting the review
router.delete("/:reviewId",isLoggedIn ,asyncWrap(async(req,res)=>{
    const listingId = req.params.id;
    const reviewId = req.params.reviewId;

    await Review.deleteOne({_id:reviewId});
    await Listing.findOneAndUpdate({_id:listingId}, {$pull:{reviews:reviewId}});
    req.flash('success',"Review Deleted");

    res.redirect(`/listings/${listingId}`);
}))


module.exports = router;
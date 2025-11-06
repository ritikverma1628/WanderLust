const asyncWrap = require('../utils/asyncWrap')
const Review = require('../models/reviews');
const Listing = require('../models/listings/listings')

module.exports.postReview = asyncWrap(async(req,res)=>{
    let review = new Review(req.body.review)
    review.author = req.user;
    const listing = await Listing.findById(req.params.id);
    listing.reviews.push(review);
    await review.save()
    await listing.save();
    req.flash('success',"New Review Created");
    res.redirect(`/listings/${req.params.id}`)
})

module.exports.destroyReview = asyncWrap(async(req,res)=>{
    const listingId = req.params.id;
    const reviewId = req.params.reviewId;

    await Review.deleteOne({_id:reviewId});
    await Listing.findOneAndUpdate({_id:listingId}, {$pull:{reviews:reviewId}});
    req.flash('success',"Review Deleted");

    res.redirect(`/listings/${listingId}`);
})
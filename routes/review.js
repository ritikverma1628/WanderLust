const express = require('express')
const router = express.Router({mergeParams:true});
const {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware');
const reviewsControllers = require('../controller/reviews')


router.post('/', isLoggedIn, validateReview, reviewsControllers.postReview)
router.delete("/:reviewId", isLoggedIn , isReviewAuthor , reviewsControllers.destroyReview)

module.exports = router;
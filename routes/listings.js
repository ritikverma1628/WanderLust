const express = require('express')
const router = express.Router();
const {isLoggedIn , isOwner, validateListing} = require('../middleware');
const listingsController = require('../controller/listings')

router
    .route('/')
    .get( listingsController.getListings)
    .post( validateListing, listingsController.postListing)

router.get("/new",isLoggedIn, listingsController.renderNewForm)

router
    .route('/:id')
    .delete( isLoggedIn , isOwner , listingsController.destroyListing)
    .patch( validateListing , isOwner , listingsController.editListing)
    .get( listingsController.showListing)


router.get("/:id/edit" , isLoggedIn , isOwner , listingsController.renderEditForm);

module.exports = router;
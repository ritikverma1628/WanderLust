const express = require('express')
const router = express.Router();
const {isLoggedIn , isOwner, validateListing} = require('../middleware');
const listingsController = require('../controller/listings')


router.get("/", listingsController.getListings)

router.get("/new",isLoggedIn, listingsController.renderNewForm)
router.post("/",validateListing, listingsController.postListing)

router.delete("/:id" , isLoggedIn , isOwner , listingsController.destroyListing)


router.get("/:id/edit" , isLoggedIn , isOwner , listingsController.renderEditForm);
router.patch("/:id" , validateListing , isOwner , listingsController.editListing)


router.get("/:id", listingsController.showListing)


module.exports = router;
const express = require('express')
const multer = require('multer')
const router = express.Router();
const {isLoggedIn , isOwner, validateListing} = require('../middleware');
const listingsController = require('../controller/listings')

const upload = multer({storage:multer.memoryStorage()})

router
    .route('/')
    .get( listingsController.getListings)
    .post(upload.single('image'),  validateListing, listingsController.postListing)

router.get("/new",isLoggedIn, listingsController.renderNewForm)

router
    .route('/:id')
    .delete( isLoggedIn , isOwner , listingsController.destroyListing)
    .patch(upload.single('image') , validateListing , isOwner , listingsController.editListing)
    .get( listingsController.showListing)


router.get("/:id/edit" , isLoggedIn , isOwner , listingsController.renderEditForm);

module.exports = router;
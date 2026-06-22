const express = require('express')
// multer ka flow samjho
// defulat enctype forms cannot send files like images with the request, so enctype has to be changed to multipart/form-data
// using this enctype will enable the form to send the files to the sever
// but express wont be able to parse the file type data in the req.body 
// here comes multer that it only injects the url-encoded/ json type data in req.body so that express can parse it and make req.file for the file type data
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
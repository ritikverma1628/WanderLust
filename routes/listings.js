const express = require('express')
const multer = require('multer')
const router = express.Router();
const {isLoggedIn , isOwner, validateListing} = require('../middleware');
const listingsController = require('../controller/listings')
const storage = require('../cloudConfig')

const upload = multer({storage})
router
    .route('/')
    .get( listingsController.getListings)
    // .post( validateListing, listingsController.postListing)
    .post(upload.single('image'), (req,res)=>{
        console.log(req.file);
        console.log(req.body)
        res.send(req.file);
    })

router.get("/new",isLoggedIn, listingsController.renderNewForm)

router
    .route('/:id')
    .delete( isLoggedIn , isOwner , listingsController.destroyListing)
    .patch( validateListing , isOwner , listingsController.editListing)
    .get( listingsController.showListing)


router.get("/:id/edit" , isLoggedIn , isOwner , listingsController.renderEditForm);

module.exports = router;
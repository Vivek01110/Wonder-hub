const express = require('express');
const router = express.Router({mergeParams:true}); 
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const Listing = require('../models/listing');
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js');
const { populate } = require('../models/reviews.js');
const listingController = require('../controller/listing.js');
const multer  = require('multer')
const { storage} = require('../CloudConfig.js');
const upload = multer({ storage })




router
    .route('/')
    .get(wrapAsync(listingController.index)) // to get all listing
    .post(
        // validateListing,
        isLoggedIn,
        upload.single('image'),
        wrapAsync(listingController.postNewListing)
    ); // <--- New Listing ---->
   
    
// new listing form
router.get('/create' , isLoggedIn, listingController.renderNewForm);

// <---- Edit ---->
router.get('/:id/edit' , 
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);


router
    .route('/:id')
    .patch(isLoggedIn,
        // validateListing,
        isOwner,
        upload.single('image'),
        wrapAsync(listingController.postEdit)) // Update listing 
    .get(wrapAsync(listingController.detailListing)) // show detail listing
    .delete(isLoggedIn, isOwner,wrapAsync(listingController.deleteListing)) // delete listing
    
module.exports = router;
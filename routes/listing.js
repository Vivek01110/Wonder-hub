const express = require('express');
const router = express.Router({mergeParams:true}); 
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const Listing = require('../models/listing');
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js');
const { populate } = require('../models/reviews.js');
const listingController = require('../controller/listing.js');




// to get all listing
router.get('/' , wrapAsync(listingController.index));

// new listing form
router.get('/create' , isLoggedIn, listingController.renderNewForm);

// <---- Edit ---->
router.get('/:id/edit' , isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));


// To recieve the patch request form the edit form of any listing
router.patch('/:id', isLoggedIn, validateListing, isOwner, wrapAsync(listingController.postEdit));


//  <---- detail listing ---->
router.get('/:id' , wrapAsync(listingController.detailListing));


// <--- New Listing ---->
router.post('/', validateListing, isLoggedIn, wrapAsync(listingController.postNewListing));

// <----Delete Listing --->
router.delete('/:id', isLoggedIn, isOwner,wrapAsync(listingController.deleteListing));

module.exports = router;
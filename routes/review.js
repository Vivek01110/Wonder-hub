const express = require('express');
const router = express.Router({mergeParams:true}); // to access :id 
const Listing = require('../models/listing');
const Review = require('../models/reviews');
const wrapAsync = require('../utils/wrapAsync'); 
const {ValidateReview, isLoggedIn, isAutherReview} = require('../middleware.js');
const reviewController = require('../controller/review.js');

// Create New Review
router.post('/', ValidateReview, isLoggedIn,wrapAsync(reviewController.CreateReview));

router.delete('/:reviewId', isLoggedIn, isAutherReview, wrapAsync(reviewController.DestroyReview));

module.exports = router;
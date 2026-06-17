const express = require('express');
const router = express.Router({mergeParams:true}); // to access :id 
const Listing = require('../models/listing');
const Review = require('../models/reviews');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const {reviewSchema} = require('../schema'); 


const ValidateReview = (req, res , next) =>{
    const {error} = reviewSchema.validate(req.body);
    console.log("review schema fields is not validated and wrong",error);

    if(error){
        throw new ExpressError(400, error);
    }
    else{
        next();
    }
}

router.post('/', ValidateReview,wrapAsync( async (req, res) =>{
    const {id} = req.params;
    const {rating , comment} = req.body.review;

    const listingtemp = await Listing.findById(id);

    const rev =  new Review({
        Comment:comment,
        rating:rating
    });

    let res1 = await rev.save();
    console.log("created review", res1);

    listingtemp.reviews.push(rev);

    let res2 = await listingtemp.save();
    console.log("listing after review posted",res2);
    req.flash("success", "New review is posted !");
    res.redirect(`/listing/${id}`);  
}));

router.delete('/:reviewId', wrapAsync(async(req, res) =>{
    let {id , reviewId} = req.params;

     await Review.findByIdAndDelete(reviewId);
     await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    req.flash("success", "review is deleted !");
     res.redirect(`/listing/${id}`);
    

}));

module.exports = router;
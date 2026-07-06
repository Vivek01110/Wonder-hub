const Listing = require('../models/listing.js');
const Review = require('../models/reviews.js');

// Add new Review
module.exports.CreateReview = async (req, res) =>{
    const {id} = req.params;
    const {rating , comment} = req.body.review;

    const listingtemp = await Listing.findById(id);

    const rev =  new Review({
        Comment:comment,
        rating:rating,
        author: req.user._id
    });

    let res1 = await rev.save();
    console.log("created review", res1);

    listingtemp.reviews.push(rev);

    let res2 = await listingtemp.save();
    console.log("listing after review posted",res2);
    req.flash("success", "New review is posted !");
    res.redirect(`/listing/${id}`);  
};

module.exports.DestroyReview = async(req, res) =>{
    let {id , reviewId} = req.params;

    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    req.flash("success", "review is deleted !");
    res.redirect(`/listing/${id}`);
};
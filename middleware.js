const Listing = require('./models/listing');
const Reviews = require('./models/reviews');
const ExpressError  =require('./utils/ExpressError');
const{ listingSchema, reviewSchema }= require('./schema');

module.exports.validateListing = (req ,res , next) =>{
    const {error} =  listingSchema.validate(req.body); // it will validate req body with the schema
    console.log(error);
    if(error){
       throw new ExpressError(400 , result.error);
    }
    else{
        next();
    }
};

module.exports.ValidateReview = (req, res , next) =>{
    const {error} = reviewSchema.validate(req.body);
    console.log("review schema fields is not validated and wrong",error);

    if(error){
        throw new ExpressError(400, error);
    }
    else{
        next();
    }
};

module.exports.isLoggedIn = async (req , res , next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you have to login to do changes");
        return res.redirect("/login");
    }

    next();
}

module.exports.saveRedirectUrl =   (req , res , next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl; // storing here because passport reset the session values after login
    }
    next();
};

module.exports.isOwner = async (req , res , next) => {
    const { id } = req.params; 
    const listing = await  Listing.findById(id);

    if(res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "you dont have access to make changes in the listing");
        return res.redirect(`/listing/${id}`);
    }

    next();
};

module.exports.isAutherReview = async (req , res , next) => {
    const {id, reviewId} = req.params; 
    const rev = await Reviews.findById(reviewId);

    if(res.locals.currUser && !rev.author .equals(res.locals.currUser._id)){
        req.flash("error", "you dont have access to make changes in the reviews");
        return res.redirect(`/listing/${id}`);
    }

    next();
};

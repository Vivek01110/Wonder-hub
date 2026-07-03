const express = require('express');
const router = express.Router({mergeParams:true}); 
const wrapAsync = require('../utils/wrapAsync');
const {listingSchema} = require('../schema'); 
const ExpressError = require('../utils/ExpressError');
const Listing = require('../models/listing');
const {isLoggedIn} = require('../middleware.js');

const validateListing = (req ,res , next) =>{
    const {error} =  listingSchema.validate(req.body); // it will validate req body with the schema
    console.log(error);
    if(error){
       throw new ExpressError(400 , result.error);
    }
    else{
        next();
    }
}

// to get all listing
router.get('/' , wrapAsync(async (req , res) =>{
    const listing =  await Listing.find();
    // console.log(listing);

    res.render("./listing/index.ejs" , {listing});
}));

// new listing form
router.get('/create' , isLoggedIn,(req, res) =>{
    
    res.render('listing/newlisting.ejs');
});

// <---- Edit ---->
router.get('/:id/edit' ,isLoggedIn, wrapAsync(async (req , res) =>{ // write it first befor post
    
    const {id} = req.params;

    const card = await Listing.findById(id);
    // console.log(card);

    if(!card){
        req.flash("error", "listing does not exist to be updated !");
        res.redirect('/listing');
    }
    else{
        res.render('./listing/edit.ejs' , {card});
    }
}));


// to recieve the patch request form the edit form of any listing
router.patch('/:id',isLoggedIn,validateListing, wrapAsync(async (req , res, next) =>{
    const { id } = req.params; 
    // you were destructuring the route param as const {_id} = req.params; but the route is defined as /listing/:id so req.params contains { id: '...' } — not _id.

    // if(!req.body.listing){ // this listing will not be in the db becasuse it is sent after editing it
    //     next(new ExpressError(400 , "send a valid request"));
    // }
    const {title , description , price , location , country , image} = req.body;
    
    const list = await Listing.findByIdAndUpdate(id, 
        {
            title:title,
            description:description,
            price:price,
            location:location,
            image:{
               filename:"listingsimage",
               url:image
            }
        },
        {new:true} // list will store updated list , new is an option
    );
    req.flash("success" , "listing is updated succesfulyy");
    //you can do this as well
    // const list = await Listing.findByIdAndUpdate(id , ...req.body.listing)

    console.log(list);
    res.redirect("/listing"); // write the route here in redirect
}));


//  <---- detail listing ---->
router.get('/:id' , wrapAsync(async (req , res) =>{
    let {id : cardId} = req.params;
    const card = await Listing.findById(cardId).populate('reviews');

    if(!card){
        req.flash("error", "listing does not exist!");
        res.redirect('/listing');
    }
    else{
        res.render('./listing/card.ejs', { card });
    }

    
}));


// <--- New Listing ---->
router.post('/', validateListing , isLoggedIn, wrapAsync(async (req , res, next) =>{
    // just print req.body and match the values
   const result =  listingSchema.validate(req.body); // it will validate req body with the schema
   console.log(result.error);
   if(result.error){
       throw new ExpressError(400 , result.error);
   }
   // no need of it because above is doing this as well
    // if(!req.body.listing){
    //     next(new ExpressError(400 , "send a valid request"));
    // }
    const {title ,description ,price ,location,country,image} = req.body;

        await Listing.insertOne(
            {
            title : title ,
            description : description,
            price :price,
            location:location,
            country:country,
            image : {
                filename:"listingsimage",
                url:image
            }
        })
        .then((resp) =>{
            // console.log("INserted listing" , resp);
            req.flash("success", "New listing is succesfully Created !!");
            res.redirect('/listing');
        })

        
}));

// <----Delete Listing --->

router.delete('/:id' , isLoggedIn,wrapAsync(async (req , res) =>{
    const { id } = req.params;

    const list = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing is succesfully deleted !");
    res.redirect('/listing');
    console.log(list);
}));

module.exports = router;
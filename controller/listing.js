const Listing = require('../models/listing');  
// all listing
module.exports.index = async (req , res) =>{
    const listing =  await Listing.find();
    res.render("./listing/index.ejs" , {listing});
};

// render new listing form
module.exports.renderNewForm = (req, res) =>{   
    res.render('listing/newlisting.ejs');
}; 
// post new listing
module.exports.postNewListing = async (req , res, next) =>{
   const result =  listingSchema.validate(req.body); // it will validate req body with the schema
   console.log(result.error);
   if(result.error){
       throw new ExpressError(400 , result.error);
   }

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
            },
            owner : req.user._id
        })
        .then((resp) =>{
            // console.log("INserted listing" , resp);
            req.flash("success", "New listing is succesfully Created !!");
            res.redirect('/listing');
        })     
}

// render edit form
module.exports.renderEditForm = async (req , res) =>{ // write it first befor post 
    const {id} = req.params;
    const card = await Listing.findById(id);
   
    if(!card){
        req.flash("error", "listing does not exist to be updated !");
        res.redirect('/listing');
    }
    else{
        res.render('./listing/edit.ejs' , {card});
    }
};

// edit route
module.exports.postEdit = async (req , res, next) =>{
    const { id } = req.params; 
    // you were destructuring the route param as const {_id} = req.params; but the route is defined as /listing/:id so req.params contains { id: '...' } — not _id.
  
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
    // const list = await Listing.findByIdAndUpdate(id , ...req.body.listing)

    console.log(list);
    res.redirect(`/listing/${id}`); // write the route here in redirect
};

// detail Listing
module.exports.detailListing = async (req , res) =>{
    let {id : cardId} = req.params;
    const card = await Listing.findById(cardId)
    .populate({
        path : "reviews",
        populate : {
            path : "author"
        },
    })
    .populate('owner');

    if(!card){
        req.flash("error", "listing does not exist!");
        res.redirect('/listing');
    }
    else{
        res.render('./listing/card.ejs', { card });
    }  
};

//delete Listing
module.exports.deleteListing = async (req , res) =>{
    const { id } = req.params;
    const list = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing is succesfully deleted !");
    res.redirect('/listing');
    console.log(list);
};



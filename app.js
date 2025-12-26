const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const {listingSchema} = require('./schema'); 

app.set('view engine' , 'ejs');
app.set('views' ,  path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

const methodOverride = require('method-override'); //method overriding (patch or delete)
app.use(methodOverride('_method'));

app.engine('ejs', ejsMate); // for boilerplate
app.use(express.static(path.join(__dirname, "/public"))); // for public folder

main().then(() =>{
    console.log("connected to db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderhub');
}

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
app.get('/listing' , wrapAsync(async (req , res) =>{
    const listing =  await Listing.find();
    // console.log(listing);

    res.render("./listing/index.ejs" , {listing});
}));

// new listing form
app.get('/listing/create' , (req, res) =>{
    res.render('./listing/newlisting.ejs');
});

// <---- Edit ---->
app.get('/listing/:id/edit' , wrapAsync(async (req , res) =>{ // write it first befor post
    
    const {id} = req.params;

    const card = await Listing.findById(id);
    // console.log(card);

    res.render('./listing/edit.ejs' , {card});

}));

// to recieve the patch request form the edit form of any listing
app.patch('/listing/:id', wrapAsync(async (req , res, next) =>{
    const { id } = req.params; 
    // you were destructuring the route param as const {_id} = req.params; but the route is defined as /listing/:id so req.params contains { id: '...' } — not _id.

    if(!req.body.listing){
        next(new ExpressError(400 , "send a valid request"));
    }
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
    //you can do this as well
    // const list = await Listing.findByIdAndUpdate(id , ...req.body.listing)

    console.log(list);
    res.redirect("/listing"); // write the route here in redirect
}));


//  <---- detail listing ---->
app.get('/listing/:id' , wrapAsync(async (req , res) =>{
    let {id : cardId} = req.params;
    const card = await Listing.findById(cardId);

    res.render('./listing/card.ejs', { card });
}));


// <--- New Listing ---->
app.post('/listing', validateListing , wrapAsync(async (req , res, next) =>{
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
            res.redirect('/listing');
        })

        
}));

// <----Delete Listing --->

app.delete('/listing/:id' , wrapAsync(async (req , res) =>{
    const { id } = req.params;

    const list = await Listing.findByIdAndDelete(id);
    res.redirect('/listing');
    console.log(list);
}));


app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req ,res,next) =>{
    let {status = 500 , message = "something went wrong"} = err;
    res.status(status).render('error.ejs', {err});
    // res.status(status).send(message);
});


app.listen(8080 ,() =>{
    console.log("listenging port number at 8080");
});

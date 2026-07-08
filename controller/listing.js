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
    let imgurl = req.file.path;
    let filename = req.file.filename;

    // console.log(filename ," ", imgurl);

    const {title ,description ,price ,location,country} = req.body;
    console.log(req.body);
        await Listing.insertOne(
            {
            title : title ,
            description : description,
            price :price,
            location:location,
            country:country,
            image : {
                filename: filename,
                url:imgurl
            },
            owner : req.user._id
        })
        .then((resp) =>{
            console.log("INserted listing" , resp);
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

    

    const {title , description , price , location , country} = req.body;
    console.log("reqBody is below");
    console.log(req.body);

    const updateData = {
        title,
        description,
        price,
        location,
        country,
    };

    if(req.file){
        updateData.image = {
            filename: req.file.filename,
            url: req.file.path,
        };
    }

    const list = await Listing.findByIdAndUpdate(id, updateData, {new:true});

    console.log("new listing");
    console.log(list);
    
    req.flash("success" , "listing is updated succesfulyy");
    // const list = await Listing.findByIdAndUpdate(id , ...req.body.listing)
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



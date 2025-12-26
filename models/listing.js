const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type: String,
        required : true,
        maxlength : 60
    },
    description:{
        type:String,
    },

    // image stored as an object with filename and url to match the seed data
    image: {
       
        filename:{
            type:String,
            default: "listing image"
        },
        url: {
            type: String,
            default:
                'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG9tZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500',

            set: (v) => v === "" ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" : v,
        },
    },

    price: Number,
    location:String,
    country : String
});

const Listing = mongoose.model("Listing" , listingSchema);

module.exports = Listing;

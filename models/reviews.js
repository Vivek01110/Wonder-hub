const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    Comment : {
        type :String,
        required: true,
        maxlength:400
    },
    rating :{
        type : Number,
        min : 1,
        max : 5
    },
    created_At :{
        type : Date,
        default : Date.now()
    } 
});

// const Review = mongoos.model("review", reviewSchema);
// module.exports = Review;

module.exports = mongoose.model('Review', reviewSchema);
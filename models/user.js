const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default || require("passport-local-mongoose");

const UserSchema = new Schema({
       
    email : {
        type: String,
        required: true
    }
   
});

// passport local mongoose will automatical add username ans password , no need to add in the field

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", UserSchema);

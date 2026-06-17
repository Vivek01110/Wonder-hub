const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const path = require('path');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override'); //method overriding (patch or delete)
const session = require('express-session');
const flash = require('connect-flash');

app.set('view engine' , 'ejs');
app.set('views' ,  path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));


const { lstat } = require('fs');
app.use(methodOverride('_method'));

app.engine('ejs', ejsMate); // for boilerplate
app.use(express.static(path.join(__dirname, "/public"))); // for public folder

const sessionOption = {  
    secret:"mysecretkey",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httplonly:true
    }
};


app.use(session(sessionOption));
app.use(flash());


const listings = require('./routes/listing');
const reviews = require('./routes/review');
const { maxHeaderSize } = require('http');

main().then(() =>{
    console.log("connected to db");
})
.catch(err => console.log(err));

async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/wonderhub');
    const dbUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/wonderhub';

    mongoose.connect(dbUrl)
        .then(() => console.log("DB Connected"))
        .catch(err => console.log(err));
}

app.use((req, res , next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use('/listing', listings);
app.use('/listing/:id/reviews', reviews);



app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req ,res,next) =>{
    let {status = 500 , message = "something went wrong"} = err;
    res.status(status).render('error.ejs', {err});
    // res.status(status).send(message);
});

const port = process.env.PORT || 8080;
app.listen(port ,() =>{
    console.log("listenging port number at 8080");
});

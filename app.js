if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const path = require('path');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override'); // (patch or delete)

app.set('view engine' , 'ejs');
app.set('views' ,  path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

const { lstat } = require('fs');
app.use(methodOverride('_method'));

app.engine('ejs', ejsMate); // for boilerplate
app.use(express.static(path.join(__dirname, "/public"))); // for public folder

const dbUrl = process.env.ATLASDB_URL;

const listingsRouter = require('./routes/listing');
const reviewsRouter = require('./routes/review');
const userRouter = require("./routes/user");

const { maxHeaderSize } = require('http');

const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const flash = require('connect-flash');

const passport = require("passport");
const LocalStrategy = require('passport-local');
const User = require('./models/user');


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60 * 1000,
});

store.on("error", (err) => {
    console.log("error in Mongo session store", err);
})
const sessionOption = {  
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httponly: true
    }
};


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res , next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

main().then(() =>{
    console.log("connected to db");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl)
}

app.get('/', (req, res) => {
    res.redirect('/listing');
});

app.use('/listing', listingsRouter);
app.use('/listing/:id/reviews', reviewsRouter);
app.use('/', userRouter);



app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req ,res,next) =>{
    let {status = 500 , message = "something went wrong"} = err;
    res.status(status).render('error.ejs', {err});
});

const port = process.env.PORT || 8080;
app.listen(port ,() =>{
    console.log("listenging port number at 8080");
});

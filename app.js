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


const listingsRouter = require('./routes/listing');
const reviewsRouter = require('./routes/review');
const userRouter = require("./routes/user");

const { maxHeaderSize } = require('http');

const session = require('express-session');
const flash = require('connect-flash');

const passport = require("passport");
const LocalStrategy = require('passport-local');
const User = require('./models/user');


const sessionOption = {  
    secret:"mysecretkey",
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




app.get('/hellouser', async (req ,res) =>{
    const fakeUser = new User({
        email :"123231vivek@gmail.com",
        username:"vinay kumar",
    });

    let RegisteredUser = await User.register(fakeUser,"vivek@123");
    res.send(RegisteredUser);
});

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



app.use('/listing', listingsRouter);
app.use('/listing/:id/reviews', reviewsRouter);
app.use('/', userRouter);



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

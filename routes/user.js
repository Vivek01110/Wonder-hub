const express = require('express');
const router = express.Router({mergeParams:true});
const User = require("../models/user");
const flash = require('connect-flash');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');


router.get("/signup",(req, res) =>{
    res.render('./users/signup.ejs');
})

router.post("/signup", wrapAsync (async (req ,res) =>{
    try{
        const {username , email , password} = req.body;
        const NewUser = new User({username, email});
        let RegisteredUser = await User.register(NewUser,password);
        
        // automatic login after singup
        req.login(RegisteredUser , (err) =>{
            if(err){
                return next(err);
            }

            req.flash("success", "User has registered succesfully");
            res.redirect('/listing');   
        })
        
        console.log(RegisteredUser);
    }
    catch(e){
        req.flash("error", e.message); 
        res.redirect('/signup');
    }
}));

router.get("/login",(req, res) =>{
    res.render('./users/login.ejs');
})

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect : "/login",
        failureFlash : true,
    }),
    async(req, res) =>{
        // res.send("welcom to WonderHub !! enjoy");
        req.flash("success","Welcom to WonderHub !!");
        
        let redirectUrl = res.locals.redirectUrl || "/listing";
        res.redirect(redirectUrl);
})

router.get("/logout", (req , res , next) =>{
    req.logout((err)=>{
        if(err){
           return  next(err);
        }

        req.flash("success", "user has logged out successfully");
        res.redirect("/listing");
    });

})



module.exports = router;


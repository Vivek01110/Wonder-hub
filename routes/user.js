const express = require('express');
const router = express.Router({mergeParams:true});
const User = require("../models/user");
const flash = require('connect-flash');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const userController = require('../controller/user');

// Render Signup form
router.get("/signup",userController.RenderSignupForm);

// post signup
router.post("/signup", wrapAsync (userController.signupUser));


// render login form
router.get("/login", userController.RenderLoginForm);

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect : "/login",
        failureFlash : true,
    }), 
     userController.LoginUser);

router.get("/logout", userController.LogoutUser);



module.exports = router;


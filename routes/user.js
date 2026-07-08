const express = require('express');
const router = express.Router({mergeParams:true});
const User = require("../models/user");
const flash = require('connect-flash');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const userController = require('../controller/user');

router
    .route("/signup")
    .get(userController.RenderSignupForm) // Render Signup form
    .post( wrapAsync (userController.signupUser)); // post signup
  
router
    .route("/login")
    .get(userController.RenderLoginForm) // render login form
    .post(saveRedirectUrl,  // login
     passport.authenticate("local", {
        failureRedirect : "/login",
        failureFlash : true,
    }), 
    userController.LoginUser);

// logout
router.get("/logout", userController.LogoutUser);



module.exports = router;


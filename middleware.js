module.exports.isLoggedIn = async (req , res , next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you have to login to do changes");
        return res.redirect("/login");
    }

    next();
}

module.exports.saveRedirectUrl =   (req , res , next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl; // storing here because passport reset the session values after login
    }


    next();
};
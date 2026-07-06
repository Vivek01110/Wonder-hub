const User = require('../models/user');
module.exports.RenderSignupForm = (req, res) =>{
    res.render('./users/signup.ejs');
};

module.exports.signupUser = async (req ,res) =>{
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
};

module.exports.RenderLoginForm = (req, res) =>{
    res.render('./users/login.ejs');
};

module.exports.LoginUser = async(req, res) =>{
    req.flash("success","Welcom to WonderHub !!");  
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};

module.exports.LogoutUser = (req , res , next) =>{
    req.logout((err)=>{
        if(err){
           return  next(err);
        }

        req.flash("success", "user has logged out successfully");
        res.redirect("/listing");
    });
};





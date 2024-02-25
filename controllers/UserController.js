const User = require("../models/user.js");
module.exports.renderSignupForm = (req,res)=>{
    res.render("./users/signup.ejs");
};

module.exports.signup = async (req,res)=>{
    try{
        let{username,email,confirmpassword,password} = req.body;
        if(confirmpassword != password){
            req.flash("passworderror","Confirm Password and Password Should be same!");
            res.redirect("/signup");
        }
        else{
            const newUser = new User({email , username});
            const registeredUser = await User.register(newUser,password);
            req.login(registeredUser,(err)=>{
                if(err){
                    next(err);
                }
                req.flash("success", `Welcome ${username}, To the WanderLust`);
                res.redirect("/listing");  
            })
        }
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async(req,res)=>{
    req.flash("success",`Welcome To WanderLust ${req.body.username} are logged in!!`);
    let redirectUrl = res.locals.redirectURL || "/listing";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out now");
        let redirectUrl = res.locals.redirectURL || "/listing";
        res.redirect(redirectUrl);
    })
}
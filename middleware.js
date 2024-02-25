const ExpressError = require("./utils/ExpressError.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const wrapAsync = require("./utils/wrapasync.js");
// For Scema Validation
const {listingSchema,reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        //Redirect Url
        req.session.redirectURL = req.originalUrl;
        req.flash("error","You have to be logged in !!");
        return res.redirect("/login");
    }
    next();
}
/*
 req.user => this trigger the isAuthenticate() method and also conatian the basic detail of the user
 if user is not logged in then it is undefined. 

 with the help of this we add our functionality if user is logged in the we show only logout option in 
 the nav bar else we shpw sign up and log in options.
 */

module.exports.saveRedirectUrl =(req,res,next)=>{
    if(req.session.redirectURL){
        res.locals.redirectURL = req.session.redirectURL;
    }
    next();
}

module.exports.isOwner = wrapAsync(async(req,res,next)=>{
    let{id} = req.params;
     let listing = await Listing.findById(id);
     if(!res.locals.currUser._id.equals(listing.owner._id)){
        req.flash("error","You don't have permission because You are not user");
        return res.redirect(`/listing/${id}/show`);
     }
     next();
})
// Validate Listing data
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(" , ");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

// Validate Review data
module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(" , ");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor = wrapAsync(async(req,res,next)=>{
    let{id,reviewId} = req.params;
     let review = await Review.findById(reviewId);
     if(!res.locals.currUser._id.equals(review.author)){
        req.flash("error","You don't have permission because You are not author");
        return res.redirect(`/listing/${id}/show`);
     }
     next();
})
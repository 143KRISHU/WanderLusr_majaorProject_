const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req,res)=>{
    let{id} = req.params;
    let associateListing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();
    associateListing.review.push(newReview);
    await associateListing.save();
    req.flash("reviewSuccess","New Review Created!");
    res.redirect(`/listing/${id}/show`);
};

module.exports.destroyReview = async(req,res)=>{
    let{id,reviewId} = req.params;
    /*
    The $pull opertor removes from an existing array
    all insrances of a value or values that match a specified condition.
    */
   await Listing.findByIdAndUpdate(id , {$pull:{review : reviewId}});
   await Review.findByIdAndDelete(reviewId);
   req.flash("reviewDeleted","Review Deleted!");
    res.redirect(`/listing/${id}/show`);
};

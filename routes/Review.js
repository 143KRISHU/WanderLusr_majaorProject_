const express = require("express");
const router = express.Router({mergeParams:true});
/*
mergeParams	: 
    Preserve the req.params values from the parent router. 
    If the parent and the child have conflicting param names, 
    the child’s value take precedence.
*/
const wrapAsync = require("../utils/wrapasync.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");
const {createReview,destroyReview} = require("../controllers/ReveiwController.js");

//Post Review Route
router.post("/",isLoggedIn,validateReview,wrapAsync(createReview));

//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(destroyReview));

module.exports=router;
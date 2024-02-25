const express = require("express");
const router = express.Router({mergeParams:true});
//for error handling
const wrapAsync = require("../utils/wrapasync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js")
const {renderSignupForm,signup,renderLoginForm,login,logout} = require("../controllers/UserController.js");

//Signup Routes
router.route("/signup")
.get(renderSignupForm)
.post( wrapAsync(signup))

//Login Routes
router.route("/login")
.get(renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate('local', {failureRedirect : '/login',failureFlash: true}),
    wrapAsync(login));

//Logout route
router.get("/logout",saveRedirectUrl,logout);

module.exports = router;
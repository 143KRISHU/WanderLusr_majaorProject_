const express = require("express");
//Multer is a node.js middleware for handling multipart/form-data, 
//which is primarily used for uploading files.
const multer = require("multer");
const {storage} = require("../Cloudconfig.js");
const upload = multer({storage});   // multer uplaod the file in the cloud storage
const router = express.Router()
const {index,add,show,create,edit, update,destroyer} = require("../controllers/ListingController.js");
//for error handling
const wrapAsync = require("../utils/wrapasync.js");
//MiddleWares
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");

//Listing Route or Index Route
router.get("/",wrapAsync(index));
 
 // Show Route
 router.get("/:id/show",wrapAsync(show));
 
 //ADD Route
 router.get("/new",isLoggedIn,add);
 
 //Create Route  // req.file is the `avatar` file
router.post("/add",isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(create))

 // Edit Route
 router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(edit));
 
 router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(update))

 router.delete("/:id",isLoggedIn,isOwner, wrapAsync(destroyer))  //Destroyer route


 module.exports=router;
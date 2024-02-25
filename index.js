if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
};
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
//  For Error Handling
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const listingRouter = require("./routes/Listing.js");
const reviewRouter = require("./routes/Review.js");
const userRouter = require("./routes/User.js");
const app = express();
const port = 3000;
// For Authentication and Authorization
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const {saveRedirectUrl,isLoggedIn} = require("./middleware.js")

app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.static(path.join(__dirname,"/public/js")));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

const dbUrl = process.env.ATLASDB;

main()
.then((res)=>{
    console.log("Data Base is Connected");})
.catch((err)=>{
    console.log(err);
})

async function main(){
     await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto :{
        secret:process.env.SECRET,
    },
    touchAfter: 24*60*60,
})

store.on("error",()=>{
    console.log("Error in MongoDb Store",err)
});

//Using Express Session
const sessionOption = {
    store : store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true,
    }
};


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());  // A middleware that intializes passport.
app.use(passport.session());  // Hashing algo used in passport is : pbkdf2 hashing algo.

// use static authenticate method of model in LocalStrategy
 passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Flashing message for adding new listing
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.deleted = req.flash("deleted");
    res.locals.listingNotFound = req.flash("listingNotFound");
    res.locals.reviewSuccess = req.flash("reviewSuccess");
    res.locals.reviewDeleted = req.flash("reviewDeleted");
    res.locals.passworderror = req.flash("passworderror");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// //Home Route
// app.get("/home",(req,res)=>{
//   res.render("listings/home.ejs");
// })

//For Listings Routes
app.use("/listing",listingRouter);

//For Review Routes
app.use("/listing/:id/reviews",reviewRouter);

//For User Routes
app.use("/",userRouter); 

// // Custom Error handlers 

// 1. For Not Created Route
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})

// 2. For all fatal Error
app.use( (err,req,res,next)=>{
    let {statusCode = 500 , message = "Something went wrong"} = err;
    res.status(statusCode).render("listings/errorpage.ejs",{message});
})

app.listen(port , ()=>{
    console.log("Server is Ready");
})
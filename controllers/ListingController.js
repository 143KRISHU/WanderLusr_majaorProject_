const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/listing.ejs",{allListing});
 };

 module.exports.show = async(req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id)
    .populate({path :'review',populate : {path:'author'},}) // nested populate
    .populate('owner');
    if(!data){
       req.flash("listingNotFound","Listing you are requested does not exist!!")
       res.redirect("/listing");
    }
    res.render("listings/show.ejs",{data});
};

module.exports.add=(req,res)=>{
    res.render("listings/newlisting.ejs");
};

module.exports.create=async(req,res,next)=>{
    // mapbox return the cordinates in the geojson format
   let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
      }).send()
    let url = req.file.path
    let {filename} = req.file;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url ,filename};
    newListing.geometry = response.body.features[0].geometry
    await newListing.save();
    req.flash("success","New Listing is added");
    res.redirect("/listing");

};

module.exports.edit=async(req,res)=>{
    let{id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
       req.flash("listingNotFound","Listing you are requested to update does not exist!!")
       res.redirect("/listing");
    }
    let originalImageUrl = listing.image.url;
    let showUrl = originalImageUrl.replace("/update","/update/h_300,w_250");
    res.render("listings/editlisting.ejs",{listing, showUrl});
};

module.exports.update=async(req,res,next)=>{
    let{id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof(req.file) !== "undefined"){
        let url = req.file.path
        let filename = req.file.filename;
        listing.image = {url , filename};
        await listing.save();
    }
    req.flash("success","Listing got Updated");
    res.redirect(`/listing/${id}/show`);
};

module.exports.destroyer = async(req,res,next)=>{
    let{id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("deleted","Listing deleted!");
    res.redirect("/listing");
};
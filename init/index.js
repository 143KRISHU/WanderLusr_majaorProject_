const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then(res => {console.log("DB is Connected")})
.catch(err => console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

async function initDB(){
   await Listing.deleteMany({});
   initData.data = initData.data.map((obj)=>({...obj, owner :"65d50ae5c21b396288ac4191"}))
   await Listing.insertMany(initData.data);
   console.log("data got intialized");
}

initDB();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type : String,
        required : true
    },
    description : {
        type: String,
        default : "Good Place To visit By."
    },
    image :{
        url : String,
        filename : String
    },
    price : {
        type : Number,
        required : true,
    },
    location:{
        type: String,
        required : true
    },
    country : {
        type : String,
        required : true,
    },
    review :[{
        type : Schema.Types.ObjectId,
        ref : "Review",
    }],
    owner : {
        type : Schema.Types.ObjectId,
        ref:"User",
    },
    geometry:{
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
});

/* When the complete listing is deleted then all the review will also 
be deleted from the review Schema */
listingSchema.post("findOneAndDelete",async(listing)=>{
    await Review.deleteMany({_id : {$in : listing.review}});
})
const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;
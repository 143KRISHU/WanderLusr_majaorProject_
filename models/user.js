const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMomgoose = require("passport-local-mongoose");

const userSchema = new Schema(
    {
        email :{
            type: String,
            required : true,
        }
    }
)

userSchema.plugin(passportLocalMomgoose);

module.exports = mongoose.model("User",userSchema);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});
userSchema.plugin(passportLocalMongoose); //automatically implement hashing username password
module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  money: {
    type: Number,
    default: 200,
  },
  spent: {
    type: Number,
    default: 0,
  },
  earned: {
    type: Number,
    default: 0,
  },
});
userSchema.plugin(passportLocalMongoose); //automatically implement hashing username password
module.exports = mongoose.model("User", userSchema);

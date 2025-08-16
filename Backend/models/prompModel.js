const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const promptSchema = new Schema({
  platform: { type: String },
  description: { type: String, required: true },

  price: { type: Number },
  images: { type: String },
});
module.exports = mongoose.model("Prompt", promptSchema);

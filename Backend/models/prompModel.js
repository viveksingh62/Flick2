const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const promptSchema = new Schema({
  platform: { type: String },
  description: { type: String, required: true },

  price: { type: Number },
  images: { type: String },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

promptSchema.index(
  {
    platform: "text",
    description: "text",
  },
  {
    weight: {
      description: 2,
      platform: 1,
    },
  },
);
module.exports = mongoose.model("Prompt", promptSchema);

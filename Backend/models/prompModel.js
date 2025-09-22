const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const promptSchema = new Schema({
  platform: { type: String },
  description: { type: String, required: true },
  secret: { type: String, required: true },
  price: { type: Number },
  images: { type: String },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },

  ],
} ,{ timestamps: true });

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
    { timestamps: true }
);

promptSchema.pre("remove", async function (next) {
  try {
    await this.model("Review").deleteMany({ _id: { $in: this.review } });
    next();
  } catch (err) {
    next(err);
  }
});
module.exports = mongoose.model("Prompt", promptSchema);

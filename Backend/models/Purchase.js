const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
    email:String,
    promptId:{type:mongoose.Schema.Types.ObjectId,ref:"Prompt"},
      boughtAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Purchase",purchaseSchema)
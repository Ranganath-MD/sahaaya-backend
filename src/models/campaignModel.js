const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const campaignSchema = new Schema({
  campaignName: {
    type: String
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String
  },
  status: {
    type: String,
    default: 'IN_DRAFT'
  },
  
})

const Campaign = mongoose.model("Campaign", campaignSchema)

module.exports = { Campaign }
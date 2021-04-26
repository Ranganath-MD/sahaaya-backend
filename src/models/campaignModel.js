const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
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
  description: {
    type: String
  },
  longDescription: {
    type: String
  },
  status: {
    type: String,
    default: 'IN_DRAFT'
  },
  fromdate: {
    type: String,
  },
  enddate: {
    type: String,
  },
  target: {
    type: Number
  },
  step1: {
    type: Boolean,
    default: false
  },
  step2: {
    type: Boolean,
    default: false
  },
  step3: {
    type: Boolean,
    default: false
  },
  step4: {
    type: Boolean,
    default: false
  }
})

const Campaign = mongoose.model("Campaign", campaignSchema)

module.exports = { Campaign }
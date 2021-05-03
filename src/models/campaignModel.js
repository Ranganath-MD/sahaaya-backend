const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const campaignSchema = new Schema({
  campaignName: { type: String },
  createdDate: { type: Date, default: Date.now },
  category: { type: String },
  description: { type: String },
  longDescription: { type: String },
  status: {
    type: String,
    enum: ["IN_DRAFT", "SUBMITTED", "IN_PROGRESS", "COMPLETED"],
    default: "IN_DRAFT",
  },
  fromdate: { type: String },
  enddate: { type: String },
  target: { type: Number },
  step1: { type: Boolean, default: false },
  step2: { type: Boolean, default: false },
  step3: { type: Boolean, default: false },
  step4: { type: Boolean, default: false },
  beneficiary: {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    dob: { type: String, default: "" },
    address: { type: String, default: "" },
    pin: { type: Number },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    phone: { type: Number },
    email: { type: String, default: "" },
    adhaar: { type: Number || String, default: "" },
  },
  campaigner : {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Campaign = mongoose.model("Campaign", campaignSchema);

module.exports = { 
  Campaign, campaignSchema
};

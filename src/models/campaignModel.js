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
    enum: ["IN_DRAFT", "IN_REVIEW", "SUBMITTED", "IN_PROGRESS", "COMPLETED"],
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
  adhaar_photo: [
    {
      url: { type: String },
      public_id: { type: String },
    },
  ],
  beneficiary_photo: [
    {
      url: { type: String },
      public_id: { type: String },
    },
  ],
  others: [
    {
      url: { type: String },
      public_id: { type: String },
    },
  ],
  campaigner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  bank: {
    bankName : { type: String },
    branch : { type: String },
    ifsccode : { type: String },
    accountName : { type: String },
    accountNumber : { type: Number }
  }
});

const Campaign = mongoose.model("Campaign", campaignSchema);

module.exports = {
  Campaign,
  campaignSchema,
};

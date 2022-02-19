const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const donationSchema = new Schema({
  donor_name: {
    type: String,
  },
  amount: {
    type: String,
  },
  donated_on: {
    type: Date,
    default: new Date(),
  },
  campaign: {
    type: Schema.Types.ObjectId,
    ref: "Campaign",
  },
  payment_id: {
    type: String,
  },
  order_id: {
    type: String,
  }
});

const Donation = mongoose.model("Donation", donationSchema);
module.exports = {
  Donation,
};

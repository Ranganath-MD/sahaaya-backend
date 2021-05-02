const express = require("express");
const { authenticateUser } = require("../middleware/authorizeUser");
const router = express.Router();
const { Campaign } = require("../models/campaignModel");

router.post("/", authenticateUser, (req, res) => {
  const body = req.body;
  const campaign = new Campaign(body);
  campaign.campaigner = req.user._id;
  campaign
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/:id", (req, res) => {
  const id = req.params.id;
  Campaign.findById(id)
    .populate("campaigner", { password: 0, tokens: 0 })
    .then((result) => {
      if (!result) {
        res.status(404).send({ message: "Campaign with this id not found" });
      } else {
        res.status(200).send(result);
      }
    })
    .catch(() => {
      res.status().send({ message: "Something went wrong" });
    });
});
const updateCampaign = async (data) => {
  try {
    const { campaignId, value } = data;
    var key = data.campaignKey;
    const campaign = await Campaign.findOneAndUpdate(
      { _id: campaignId },
      { [key]: value },
      { new: true }
    );
    return campaign;
  } catch (err) {
    console.log(err);
  }
};

const updateBeneficiary = async (data) => {
  try {
    const { campaignId, value } = data;
    var key = data.campaignKey;
    const campaign = await Campaign.findOne({ _id: campaignId });
    campaign.beneficiary[key] = value;
    campaign.save();
    return campaign;
  }catch (err) {
    console.log(err);
  }
}

module.exports = {
  campaignRouter: router,
  updateCampaign,
  updateBeneficiary
};

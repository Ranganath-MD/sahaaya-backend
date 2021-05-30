const express = require("express");
const { authenticateUser } = require("../middleware/authorizeUser");
const router = express.Router();
const { Campaign } = require("../models/campaignModel");
const { User } = require("../models/userModel");
const { upload } = require("../utils/multer");
const { cloudinary } = require("../utils/cloudinary");
const { fetchBankDetails } = require("../utils/ifsc");

router.get("/all", authenticateUser, async (req, res) => {
  try {
    const result = await Campaign.find({ campaigner: req.user._id });
    res.send(result);
  } catch {
    res.send({ message: "Something went wrong while fetching" });
  }
})

router.post("/", authenticateUser, async (req, res) => {
  try {
    const body = req.body;
    const campaign = new Campaign(body);
    campaign.campaigner = req.user._id;
    const result = await campaign.save();
    const { campaigner } = result;
    const user = await User.findOne(campaigner);
    user.campaigns.push(result._id);
    user.save();
    res.send(result);
  } catch (err) {
    res.send(err);
  }
});

router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Campaign.findByIdAndDelete(id);
    if(result) {
      await User.findByIdAndUpdate(
        result.campaigner,
        {
          $pull: { "campaigns" : result._id },
        },
        { new: true }
      );

      result && result.adhaar_photo.length !== 0 && result.adhaar_photo.forEach(async (item) => {
        await cloudinary.uploader.destroy(item.public_id);
      })
      result && result.beneficiary_photo.length !== 0 && result.beneficiary_photo.forEach(async (item) => {
        await cloudinary.uploader.destroy(item.public_id);
      })
      result && result.others.length !== 0 && result.others.forEach(async (item) => {
        await cloudinary.uploader.destroy(item.public_id);
      })
    }
    const campaigns = await Campaign.find({ campaigner: result.campaigner._id })
    res.send({
      message: "Successfully Deleted the Record",
      deleted_record: result,
      campaigns
    });
  }catch (err) {
    console.log(err)
    res.send({ message: "Something went wrong while deleteing the record" });
  }
})

const uploadFile = async (req) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    return result;
  } catch (err) {
    console.log(err);
  }
};
router.delete("/files/delete", async (req, res) => {
  try {
    const data = await cloudinary.uploader.destroy(req.body.public_id);
    if (data.result === "ok") {
      const data = await Campaign.findByIdAndUpdate(
        req.body.campaignId,
        {
          $pull: { [req.body.key]: { public_id: req.body.public_id } },
        },
        { new: true }
      );
      res.send({
        message: "Successfully deleted",
        files: data[req.body.key],
      });
    }
  } catch (err) {
    console.log(err);
  }
});
router.post("/upload", upload, async (req, res) => {
  try {
    const result = await uploadFile(req);
    const file = {
      url: result.url,
      public_id: result.public_id,
    };
    const campaign = await Campaign.findOne({ _id: req.body.campaignId });
    campaign[req.body.key].push(file);
    await campaign.save();
    res.status(200).send({
      message: "Successfully added file",
      files: campaign[req.body.key],
    });
  } catch (err) {
    console.log(err);
  }
});
router.get("/ifsc/:ifsc", async (req, res) => {
  try {
    const result = await fetchBankDetails(req.params.ifsc);
    res.send(result)
  } catch {
    res.send("Something went wrong")
  }
})
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Campaign.findById(id).populate("campaigner", {
      password: 0,
      tokens: 0,
    });
    if (!result) {
      res.status(404).send({ message: "Campaign with this id not found" });
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    res.status().send({ message: "Something went wrong" });
  }
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
  } catch (err) {
    console.log(err);
  }
};
const updateBankDetails = async (data) => {
  try {
    const { campaignId, value } = data;
    var key = data.campaignKey;
    const campaign = await Campaign.findOne({ _id: campaignId });
    campaign.bank[key] = value;
    campaign.save();
    return campaign;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  campaignRouter: router,
  updateCampaign,
  updateBeneficiary,
  updateBankDetails
};

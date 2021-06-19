const express = require("express");
const { Router } = require("express");
const { authenticateUser } = require("../middleware/authorizeUser");
const { checkAdmin } = require("../middleware/isadmin");
const { Campaign } = require("../models/campaignModel");
const router = Router();

router.get("/all-campaigns", checkAdmin, async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.send({ count: campaigns.length, campaigns })
  } catch (err) {}
});

module.exports = {
  adminRouter: router
}

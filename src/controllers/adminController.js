const express = require("express");
const { Router } = require("express");
const { authenticateUser } = require("../middleware/authorizeUser");
const { checkAdmin } = require("../middleware/isadmin");
const { Campaign } = require("../models/campaignModel");
const router = Router();

router.get("/dashboard", checkAdmin, async (req, res) => {
  try {
    console.log(Campaign.countDocument());
  } catch (err) {}
});
router.get("/campaigns-under-review", checkAdmin, async (req, res) => {
  const { sortBy, direction, page, perPage } = req.query;
  const resultsPerPage = perPage ? perPage : 5;
  let pageNumber = page >= 1 ? page : 1;
  let totalPages = 0;
  try {
    const total = await Campaign.countDocuments({ status: "IN_REVIEW" });
    totalPages = Math.ceil(total / resultsPerPage)
    const campaigns = await Campaign
      .find({ status: "IN_REVIEW" })
      .populate("campaigner", "id username avatar email")
      .sort({ [sortBy]: direction })
      .limit(parseInt(resultsPerPage))
      .skip(parseInt(resultsPerPage) * (parseInt(pageNumber)-1));
    res.send({
      count: campaigns.length,
      total,
      totalPages,
      sortBy,
      direction,
      campaigns,
    });
  } catch (err) {
    console.log(err);
    res.send({ message: "Not able to fetch campaigns" });
  }
});

module.exports = {
  adminRouter: router,
};

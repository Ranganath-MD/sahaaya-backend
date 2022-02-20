const express = require("express");
const { Router } = require("express");
const { checkAdmin } = require("../middleware/isadmin");
const { Campaign } = require("../models/campaignModel");
const { User } = require("../models/userModel");
const router = Router();

router.get("/dashboard", checkAdmin, async (req, res) => {
  let donation = 0;
  try {
    const campaigns = await Campaign.find({ status: { $ne: "IN_DRAFT" } })
      .sort({ submittedDate: "desc" })
      .populate("campaigner", "id username avatar email");
    const count_campaigns = await Campaign.countDocuments({
      status: { $ne: "IN_DRAFT" },
    });
    
    for (let campaign of campaigns) {
      donation = donation + campaign.donation;
    }

    console.log(donation);
    const campaigners = await User.find()
      .select("username email avatar campaigns")
      .where("campaigns")
      .ne([]);
    const count_campaigners = await User.countDocuments({
      campaigns: { $ne: [] },
    });
    res.send({
      campaigns,
      total_campaigns: count_campaigns,
      campaigners,
      total_donation: donation,
      total_campaigners: count_campaigners,
    });
  } catch (err) {
    res.send({ message: "Not able to fetch Dashboard data" });
  }
});

router.get("/campaigns-under-review", checkAdmin, async (req, res) => {
  const { sortBy, direction, page, perPage } = req.query;
  const resultsPerPage = perPage ? perPage : 5;
  let pageNumber = page >= 1 ? page : 1;
  let totalPages = 0;
  try {
    const total = await Campaign.countDocuments({ status: "IN_REVIEW" });
    totalPages = Math.ceil(total / resultsPerPage);
    const campaigns = await Campaign.find({ status: "IN_REVIEW" })
      .populate("campaigner", "id username avatar email")
      .sort({ [sortBy]: direction })
      .limit(parseInt(resultsPerPage))
      .skip(parseInt(resultsPerPage) * (parseInt(pageNumber) - 1));
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

const campaignByStatusOption = [
  {
    $group: {
      _id: null,
      IN_REVIEW: {
        $sum: {
          $cond: [{ $eq: ["$status", "IN_REVIEW"] }, 1, 0],
        },
      },
      IN_DRAFT: {
        $sum: {
          $cond: [{ $eq: ["$status", "IN_DRAFT"] }, 1, 0],
        },
      },
      APPROVED: {
        $sum: {
          $cond: [{ $eq: ["$status", "APPROVED"] }, 1, 0],
        },
      },
      REJECTED: {
        $sum: {
          $cond: [{ $eq: ["$status", "REJECTED"] }, 1, 0],
        },
      },
      COMPLETED: {
        $sum: {
          $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0],
        },
      },
    },
  },
]

const byCatergoryOptions = [
  {
    $group: {
      _id: null,
      farmers: {
        $sum: {
          $cond: [{ $eq: ["$category", "Farmers"] }, 1, 0],
        },
      },
      talents: {
        $sum: {
          $cond: [{ $eq: ["$category", "Talents"] }, 1, 0],
        },
      },
      movies: {
        $sum: {
          $cond: [{ $eq: ["$category", "Movie Makers"] }, 1, 0],
        },
      },
      startups: {
        $sum: {
          $cond: [{ $eq: ["$category", "Start up"] }, 1, 0],
        },
      },
    }
  }
]
const donation = [
  { index: "Jan", donation: 2000000, campaigns: 10 },
  { index: "Feb", donation: 3500000, campaigns: 12 },
  { index: "Mar", donation: 3800000, campaigns: 2 },
  { index: "Apr", donation: 4000000, campaigns: 0 },
  { index: "May", donation: 4100000, campaigns: 3 },
  { index: "Jun", donation: 4350000, campaigns: 10 },
  { index: "Jul", donation: 4500000, campaigns: 12 },
  { index: "Aug", donation: 4600000, campaigns: 5 },
  { index: "Sep", donation: 5000000, campaigns: 6 },
  { index: "Oct", donation: 5500000, campaigns: 8 },
  { index: "Nov", donation: 6000000, campaigns: 10 },
  { index: "Dec", donation: 6500000, campaigns: 8 },
];
router.get("/analytics", checkAdmin, async (req, res) => {
  try {
    const campaignsByStatus = await Campaign.aggregate(campaignByStatusOption);
    const campaignsBycategory = await Campaign.aggregate(byCatergoryOptions);
    res.send({ 
      campaignsByStatus: campaignsByStatus[0],
      campaignsBycategory: campaignsBycategory[0],
      donation
     })
  } catch(error) {
    console.log(error);
  }
});

module.exports = {
  adminRouter: router,
};

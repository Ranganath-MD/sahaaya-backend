const express = require('express');
const { authenticateUser } = require('../middleware/authorizeUser');
const router = express.Router();
const { Campaign } = require('../models/campaignModel');

router.post("/", authenticateUser, (req, res) => {
  const body = req.body;
  const campaign = new Campaign(body);
  campaign.save()
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      console.log(err)
    })
})
router.get("/:id", (req, res) => {
  const id = req.params.id;
  Campaign.findById(id)
    .then((result) => {
      if(!result) {
        res.status(404).send({ message: "Campaign with this id not found" })
      }else {
        res.status(200).send(result);
      }
    })
    .catch(() => {
      res.status().send({ message: "Something went wrong" })
    })
})

module.exports = {
  campaignRouter: router
}
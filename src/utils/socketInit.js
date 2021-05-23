const { updateCampaign, updateBeneficiary, updateBankDetails } = require("../controllers/campaignController");

exports.socketConnection = socketConnections = (socket) => {
  socket.on('update-campaign', async (data) => {
    const campaign = await updateCampaign(data);
    socket.emit("campaign", campaign)
  })
  socket.on('update-beneficiary', async (data) => {
    const campaign = await updateBeneficiary(data);
    socket.emit("campaign", campaign)
  })
  socket.on('update-bank-details', async (data) => {
    const campaign = await updateBankDetails(data);
    socket.emit("campaign", campaign)
  })
}


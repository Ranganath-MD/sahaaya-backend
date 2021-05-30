const { updateCampaign, updateBeneficiary, updateBankDetails } = require("../controllers/campaignController");
const { updateUser } = require("../controllers/usersController");

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
  socket.on('update-user', async (data) => {
    const user = await updateUser(data);
    socket.emit("user", user)
  })
}


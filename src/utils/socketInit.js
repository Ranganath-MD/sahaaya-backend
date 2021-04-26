const { updateCampaign } = require("../controllers/campaignController");

exports.socketConnection = socketConnections = (socket) => {
  socket.on('update-campaign', async (data) => {
    const campaign = await updateCampaign(data);
    socket.emit("campaign", campaign)
  })
}


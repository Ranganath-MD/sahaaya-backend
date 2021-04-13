
exports.socketConnection = socketConnections = (socket) => {
  socket.on('campaign name', data => {
    socket.emit('name', data)
  })
}


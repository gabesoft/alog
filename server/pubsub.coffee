module.exports = (app, pub, sub) ->
  io = require('socket.io').listen(app)
  ch = 'items-change'

  io.configure () ->
    io.set 'transports', ['xhr-polling']
    io.set 'polling duration', 10
  io.sockets.on 'connection', (socket) ->
    sub.on 'subscribe', (channel, count) ->
      console.log "subscribed to #{channel}:#{count}"

    sub.on 'message', (channel, message) ->
      data = JSON.parse message
      name = "#{ch}-#{data.user}"
      socket.emit name, data.data

    sub.subscribe ch

  fireChangeEvent = (req, data) ->
    wrap =
      user: req.session.user.name
      data: data
    pub.publish ch, (JSON.stringify wrap)

  notifyItemAdd: (req, item) ->
    fireChangeEvent req,
      item:   item
      action: 'add'

  notifyItemDel: (req, item) ->
    fireChangeEvent req,
      item:   item
      action: 'del'

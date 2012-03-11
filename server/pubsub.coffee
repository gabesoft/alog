module.exports = (app, pub, sub) ->
  io = require('socket.io').listen(app)
  ch = 'items-change'

  io.sockets.on 'connection', (socket) ->
    sub.on 'subscribe', (channel, count) ->
      console.log "subscribed to #{channel}:#{count}"

    sub.on 'message', (channel, message) ->
      data = JSON.parse message
      name = "#{ch}-#{data.user}"
      socket.emit name, data.data

    sub.subscribe ch

  change = (req, data) ->
    wrap =
      user: req.session.user.name
      data: data
    pub.publish ch, (JSON.stringify wrap)

  itemAdd: (req, item) ->
    change req,
      data:   item
      action: 'add'

  itemDel: (req, item) ->
    change req,
      data:   item
      action: 'del'

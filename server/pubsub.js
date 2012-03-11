(function() {

  module.exports = function(app, pub, sub) {
    var ch, fireChangeEvent, io;
    io = require('socket.io').listen(app);
    ch = 'items-change';
    io.sockets.on('connection', function(socket) {
      sub.on('subscribe', function(channel, count) {
        return console.log("subscribed to " + channel + ":" + count);
      });
      sub.on('message', function(channel, message) {
        var data, name;
        data = JSON.parse(message);
        name = "" + ch + "-" + data.user;
        return socket.emit(name, data.data);
      });
      return sub.subscribe(ch);
    });
    fireChangeEvent = function(req, data) {
      var wrap;
      wrap = {
        user: req.session.user.name,
        data: data
      };
      return pub.publish(ch, JSON.stringify(wrap));
    };
    return {
      notifyItemAdd: function(req, item) {
        return fireChangeEvent(req, {
          item: item,
          action: 'add'
        });
      },
      notifyItemDel: function(req, item) {
        return fireChangeEvent(req, {
          item: item,
          action: 'del'
        });
      }
    };
  };

}).call(this);
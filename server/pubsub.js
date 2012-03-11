(function() {

  module.exports = function(app, pub, sub) {
    var ch, change, io;
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
    change = function(req, data) {
      var wrap;
      wrap = {
        user: req.session.user.name,
        data: data
      };
      return pub.publish(ch, JSON.stringify(wrap));
    };
    return {
      itemAdd: function(req, item) {
        return change(req, {
          data: item,
          action: 'add'
        });
      },
      itemDel: function(req, item) {
        return change(req, {
          data: item,
          action: 'del'
        });
      }
    };
  };

}).call(this);

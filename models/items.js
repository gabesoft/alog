(function() {

  module.exports = function(redis) {
    var key;
    key = 'items';
    redis.on('error', function(e) {
      return console.log(e);
    });
    return {
      find: function(id) {
        return {
          id: id,
          text: 'first item 1',
          date: new Date()
        };
      },
      add: function(item, callback) {
        if (item) {
          return redis.incr('item.id', function(err, id) {
            item.id = id;
            redis.lpush(key, JSON.stringify(item));
            if (callback) return callback(item);
          });
        }
      },
      get: function(start, end, callback) {
        return redis.lrange(key, start, end, function(err, reply) {
          if (callback) return callback(reply.map(JSON.parse));
        });
      },
      getAll: function(callback) {
        return redis.llen(key, function(err, count) {
          return redis.lrange(key, 0, count, function(err, reply) {
            if (callback) return callback(reply.map(JSON.parse));
          });
        });
      }
    };
  };

}).call(this);

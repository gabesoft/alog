(function() {

  module.exports = function(redis) {
    var MAX_ITEMS, key;
    MAX_ITEMS = 1000;
    key = 'items';
    redis.on('error', function(e) {
      return console.log(e);
    });
    return {
      add: function(item, callback) {
        if (item == null) return;
        return redis.incr('item.id', function(err, id) {
          item.id = id;
          return redis.lpush(key, JSON.stringify(item), function() {
            return redis.ltrim(key, 0, MAX_ITEMS, function() {
              return typeof callback === "function" ? callback(item) : void 0;
            });
          });
        });
      },
      pop: function(callback) {
        return redis.lpop(key, function(item) {
          return typeof callback === "function" ? callback(item) : void 0;
        });
      },
      get: function(start, end, callback) {
        return redis.lrange(key, start, end, function(err, reply) {
          return typeof callback === "function" ? callback(reply.map(JSON.parse)) : void 0;
        });
      },
      len: function(callback) {
        return redis.llen(key, function(err, count) {
          return typeof callback === "function" ? callback(count) : void 0;
        });
      }
    };
  };

}).call(this);

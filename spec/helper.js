(function() {

  module.exports = function(redis, items, users) {
    return {
      reset: function() {
        return redis.flushdb();
      }
    };
  };

}).call(this);

(function() {

  module.exports = function(redis, items) {
    return {
      reset: function() {
        return redis.flushdb();
      },
      addItem: function(item) {
        var added;
        added = false;
        items.add(item, function() {
          return added = true;
        });
        return waitsFor(function() {
          return added;
        });
      }
    };
  };

}).call(this);

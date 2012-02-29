(function() {

  module.exports = function(redis) {
    return {
      resetDb: function() {
        this.client = redis.createClient();
        this.client.flushdb();
        return this.client;
      },
      closeDb: function() {
        return this.client.quit();
      }
    };
  };

}).call(this);

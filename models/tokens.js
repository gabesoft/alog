(function() {
  var mktoken, reset;

  mktoken = function() {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  };

  reset = function(token) {
    return token.token = mktoken();
  };

  module.exports = function(redis) {
    return {
      save: function(token, callback) {
        reset(token);
        return redis.set("" + token.name + ":" + token.id, JSON.stringify(token), function(err, res) {
          return callback(token);
        });
      },
      create: function(username, callback) {
        return {
          name: username,
          id: mktoken(),
          token: mktoken()
        };
      },
      parse: JSON.parse,
      stringify: JSON.stringify
    };
  };

}).call(this);

(function() {
  var mkkey, mktoken;

  mktoken = function() {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  };

  mkkey = function(token) {
    return "" + token.name + ":" + token.id;
  };

  module.exports = function(redis) {
    return {
      save: function(token, callback) {
        token.token = mktoken();
        return redis.set(mkkey(token), JSON.stringify(token), function(err, res) {
          return callback(token);
        });
      },
      remove: function(token, callback) {
        return redis.del(mkkey(token), function(err, count) {
          return callback(count);
        });
      },
      create: function(username) {
        return {
          name: username,
          id: mktoken(),
          token: mktoken()
        };
      },
      verify: function(token, callback) {
        return redis.get(mkkey(token), function(err, res) {
          var saved;
          saved = JSON.parse(res);
          if ((saved != null ? saved.token : void 0) === token.token) {
            return callback(saved);
          } else {
            return callback(null);
          }
        });
      },
      parse: JSON.parse,
      stringify: JSON.stringify
    };
  };

}).call(this);

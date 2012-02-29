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
        return 0;
      },
      create: function(username) {
        console.log('creating');
        return {
          name: username,
          id: mktoken(),
          token: mktoken()
        };
      },
      verify: function(token, callback) {
        return redis.get(mkkey(token), function(err, res) {
          if ((res != null ? res.token : void 0) === token.token) {
            return callback(res);
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

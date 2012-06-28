(function() {

  module.exports = function() {
    var redis, url;
    url = require('url');
    redis = require('redis');
    return {
      parseUrl: function(redisUrl) {
        var auth, rurl, _ref;
        if (!(redisUrl != null)) return null;
        rurl = url.parse(redisUrl);
        auth = (_ref = rurl.auth) != null ? _ref.split(':') : void 0;
        return {
          host: rurl.hostname,
          port: rurl.port,
          db: auth[0],
          pass: auth[1]
        };
      },
      redisClient: function(db) {
        var client, config;
        config = this.parseUrl(process.env.REDISTOGO_URL);
        client = null;
        if (config != null) {
          client = redis.createClient(config.port, config.host);
          client.auth(config.pass);
        } else {
          client = redis.createClient();
        }
        client.select(db, function(res, err) {
          return console.log(res, err);
        });
        client.on('error', function(e) {
          return console.log(e);
        });
        return client;
      }
    };
  };

}).call(this);

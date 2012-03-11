(function() {

  module.exports = function() {
    var redis, url;
    url = require('url');
    redis = require('redis');
    return {
      parseUrl: function(redisUrl) {
        var auth, rurl;
        if (!(redisUrl != null)) return null;
        rurl = url.parse(redisUrl);
        auth = rurl.auth.split(':');
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

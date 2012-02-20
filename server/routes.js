(function() {

  module.exports = function(app) {
    var items, loadItem, redis, redisClient, url;
    redis = require('redis');
    url = require('url');
    redisClient = function() {
      var auth, client, rurl;
      if (process.env.REDISTOGO_URL) {
        rurl = url.parse(process.env.REDISTOGO_URL);
        auth = rurl.auth.split(':');
        client = redis.createClient(rurl.port, rurl.hostname);
        client.auth(auth[1]);
        return client;
      } else {
        return redis.createClient();
      }
    };
    items = require('../models/items.js')(redis.createClient());
    loadItem = function(req, res, next) {
      req.item = items.find(req.params.id);
      return next();
    };
    app.get('/', function(req, res) {
      req.session.views++;
      return res.render('index', {
        title: req.session.views + ' Views'
      });
    });
    return app.get('/item/:id', loadItem, function(req, res) {
      return res.send(req.item);
    });
  };

}).call(this);

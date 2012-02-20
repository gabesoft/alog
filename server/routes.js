(function() {

  module.exports = function(app) {
    var createRedisClient, items, loadItem, redis, redisClient, url;
    redis = require('redis');
    url = require('url');
    createRedisClient = function() {
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
    redisClient = createRedisClient();
    items = require('../models/items.js')(redisClient);
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
    app.get('/item/:id', loadItem, function(req, res) {
      return res.send(req.item);
    });
    return app.get('/item', function(req, res) {
      return items.getAll(function(list) {
        res.send(list);
        return redisClient.quit();
      });
    });
  };

}).call(this);

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
      return res.render('index', {
        title: 'Activity Log'
      });
    });
    app.get('/item/:id', loadItem, function(req, res) {
      return res.send(req.item);
    });
    app.get('/item', function(req, res) {
      return items.getAll(function(list) {
        return res.send(list);
      });
    });
    return app.post('/item', function(req, res) {
      return items.add(req.body, function(item) {
        return res.send(item);
      });
    });
  };

}).call(this);

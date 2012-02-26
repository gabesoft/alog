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
        title: 'Log Book'
      });
    });
    app.get('/items/:id', loadItem, function(req, res) {
      return res.send(req.item);
    });
    app.get('/items', function(req, res) {
      var limit, start;
      start = Number(req.query.start || 0);
      limit = Number(req.query.limit || 10);
      return items.get(start, start + limit - 1, function(list) {
        return res.send(list);
      });
    });
    app.post('/items', function(req, res) {
      return items.add(req.body, function(item) {
        return res.send(item);
      });
    });
    app["delete"]('/items', function(req, res) {
      return items.pop(function(item) {
        return res.send(item);
      });
    });
    app.get('/login', function(req, res) {
      return res.render('login', {
        title: 'Log Book',
        info: 'Info',
        error: ''
      });
    });
    return app.post('/login', function(req, res) {
      return res.render('login', {
        title: 'Log Book',
        info: '',
        error: 'Error'
      });
    });
  };

}).call(this);

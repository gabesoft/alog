(function() {

  module.exports = function(app) {
    var authenticate, createRedisClient, items, redis, redisClient, url, users;
    redis = require('redis');
    url = require('url');
    createRedisClient = function() {
      var auth, client, rurl;
      client = null;
      if (process.env.REDISTOGO_URL != null) {
        rurl = url.parse(process.env.REDISTOGO_URL);
        auth = rurl.auth.split(':');
        client = redis.createClient(rurl.port, rurl.hostname);
        client.auth(auth[1]);
      } else {
        client = redis.createClient();
      }
      client.select(app.set('redisdb'), function(res, err) {
        return console.log(res, err);
      });
      return client;
    };
    redisClient = createRedisClient();
    redisClient.on('error', function(e) {
      return console.log(e);
    });
    items = require('../models/items.js')(redisClient);
    users = require('../models/users.js')(redisClient);
    authenticate = function(req, res, next) {
      if (req.session.user) {
        return next();
      } else {
        return res.redirect('/login');
      }
    };
    app.get('/', authenticate, function(req, res) {
      return res.render('index', {
        title: 'Log Book'
      });
    });
    app.get('/items', authenticate, function(req, res) {
      var limit, start;
      start = Number(req.query.start || 0);
      limit = Number(req.query.limit || 10);
      return items.get(start, start + limit - 1, function(list) {
        return res.send(list);
      });
    });
    app.post('/items', authenticate, function(req, res) {
      return items.add(req.body, function(item) {
        return res.send(item);
      });
    });
    app["delete"]('/items', authenticate, function(req, res) {
      return items.pop(function(item) {
        return res.send(item);
      });
    });
    app.get('/login', function(req, res) {
      return res.render('login', {
        title: 'Log Book'
      });
    });
    return app.post('/login', function(req, res) {
      var cred;
      cred = req.body.user;
      return users.authenticate(cred.name, cred.pass, function(user) {
        if (user != null) {
          req.session.user = user;
          return res.redirect('/');
        } else {
          req.flash('warn', 'login failed');
          return res.render('login', {
            title: 'Log Book'
          });
        }
      });
    });
  };

}).call(this);

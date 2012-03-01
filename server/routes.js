(function() {

  module.exports = function(app) {
    var TITLE, auth, authenticate, createRedisClient, items, itemsModule, redis, redisClient, render, url, users;
    TITLE = 'Log Book';
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
    itemsModule = require('../models/items.js')(redisClient);
    auth = require('./auth')(app, redisClient);
    users = require('../models/users.js')(redisClient);
    items = null;
    authenticate = function(req, res, next) {
      var failure, success;
      success = function() {
        items = itemsModule.create(req.session.user);
        return next();
      };
      failure = function() {
        return res.redirect('/login');
      };
      return auth.authenticate(req, res, success, failure);
    };
    render = function(res, page, layout, title) {
      return res.render(page, {
        title: TITLE,
        titleInfo: title,
        layout: "layouts/" + layout
      });
    };
    app.get('/', authenticate, function(req, res) {
      return render(res, 'index', 'main', req.session.user.name);
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
    app.get('/signup', function(req, res) {
      return render(res, 'signup', 'login', 'Signup');
    });
    app.get('/logout', function(req, res) {
      return auth.logout(req, res, function() {
        return res.redirect('/login');
      });
    });
    app.get('/login', function(req, res) {
      return render(res, 'login', 'login', 'Login');
    });
    app.post('/login', function(req, res) {
      var failure, success;
      success = function() {
        return res.redirect('/');
      };
      failure = function() {
        req.flash('warn', 'login failed');
        return res.redirect('/login');
      };
      return auth.login(req, res, success, failure);
    });
    return app.post('/users', function(req, res) {
      var cred;
      cred = req.body.user;
      console.log(cred);
      if (cred.name === '') {
        req.flash('warn', "The user name cannot be blank");
        return res.redirect('/signup');
      } else if (cred.pass === '') {
        req.flash('warn', "Blank passwords are not allowed");
        return res.redirect('/signup');
      } else if (cred.pass !== cred.pass2) {
        req.flash('warn', "Passwords don't match");
        return res.redirect('/signup');
      } else {
        return users.create(cred.name, cred.pass, function(err, user) {
          if (err != null) {
            req.flash('warn', err.message);
            return res.redirect('/signup');
          } else {
            return auth.reset(req, res, user, function() {
              return res.redirect('/');
            });
          }
        });
      }
    });
  };

}).call(this);

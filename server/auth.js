(function() {

  module.exports = function(app, redis) {
    var COOKIE, initContext, persist, toLogin, tokens, users;
    COOKIE = 'logintoken';
    tokens = require('../models/tokens.js')(redis);
    users = require('../models/users.js')(redis);
    persist = function(res, token) {
      var opts;
      opts = {
        expires: new Date(Date.now() + 2 * 604800000),
        path: '/'
      };
      return res.cookie(COOKIE, tokens.stringify(token), opts);
    };
    initContext = function(req, res, user, token, next) {
      req.session.user = user;
      return tokens.save(token, function() {
        persist(res, token);
        return next();
      });
    };
    toLogin = function(res) {
      return res.redirect('/login');
    };
    return {
      authenticate: function(req, res, next) {
        var token;
        if (req.session.user) {
          return next();
        } else if (req.cookies.token != null) {
          token = tokens.parse(req.cookies[COOKIE]);
          return tokens.verify(token, function(verified) {
            if (verified != null) {
              return users.get(token.name, function(user) {
                if (user != null) {
                  return initContext(req, res, user, token, next);
                } else {
                  return toLogin(res);
                }
              });
            } else {
              return toLogin(res);
            }
          });
        } else {
          return toLogin(res);
        }
      },
      logout: function(req, res, next) {
        var token;
        if (!(req.session != null)) {
          next();
          return;
        }
        if (req.session.token != null) {
          token = tokens.parse(req.session.token);
          return tokens.remove(token, function(count) {
            res.clearCookie(COOKIE);
            return req.session.destroy(function() {
              return next();
            });
          });
        } else {
          return req.session.destroy(function() {
            return next();
          });
        }
      },
      login: function(req, res, next) {
        var cred;
        cred = req.body.user;
        return users.authenticate(cred.name, cred.pass, function(user) {
          var token;
          if (user != null) {
            token = tokens.create(user.name);
            return initContext(req, res, user, token, next);
          } else {
            req.flash('warn', 'login failed');
            return toLogin(res);
          }
        });
      },
      reset: function(req, res, next) {
        var cred;
        cred = req.body.user;
        return users.create(cred.name, cred.pass, function(err, user) {
          var token;
          if (err != null) {
            req.flash('warn', err.message);
            return res.redirect('/signup');
          } else {
            token = tokens.create(user.name);
            return initContext(req, res, user, token, next);
          }
        });
      }
    };
  };

}).call(this);

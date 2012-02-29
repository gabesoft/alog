(function() {

  module.exports = function(app, redis) {
    var COOKIE, initContext, toLogin, tokens, users;
    COOKIE = 'logintoken';
    tokens = require('../models/tokens.js')(redis);
    users = require('../models/users.js')(redis);
    initContext = function(req, res, user, token, next) {
      return tokens.save(token, function() {
        var opts;
        opts = {
          expires: new Date(Date.now() + 2 * 604800000),
          path: '/'
        };
        res.cookie(COOKIE, tokens.stringify(token), opts);
        req.session.user = user;
        console.log('saved', token);
        return next();
      });
    };
    toLogin = function(res) {
      return res.redirect('/login');
    };
    return {
      authenticate: function(req, res, next) {
        var token;
        console.log('auth', req.session.user, req.cookies[COOKIE]);
        if (req.session.user) {
          return next();
        } else if (req.cookies[COOKIE] != null) {
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
        if (req.cookies[COOKIE] != null) {
          token = tokens.parse(req.cookies[COOKIE]);
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

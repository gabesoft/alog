(function() {

  module.exports = function(app, redis) {
    var COOKIE, initContext, tokens, users;
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
        return next();
      });
    };
    return {
      authenticate: function(req, res, success, failure) {
        var token;
        if (req.session.user) {
          return success();
        } else if (req.cookies[COOKIE] != null) {
          token = tokens.parse(req.cookies[COOKIE]);
          return tokens.verify(token, function(verified) {
            if (verified != null) {
              return users.get(token.name, function(user) {
                if (user != null) {
                  return initContext(req, res, user, token, success);
                } else {
                  return failure();
                }
              });
            } else {
              return failure();
            }
          });
        } else {
          return failure();
        }
      },
      logout: function(req, res, next) {
        var token;
        if (req.cookies[COOKIE] != null) {
          token = tokens.parse(req.cookies[COOKIE]);
          return tokens.remove(token, function() {
            res.clearCookie(COOKIE);
            if (req.session != null) {
              return req.session.destroy(next);
            } else {
              return next();
            }
          });
        } else if (req.session != null) {
          return req.session.destroy(next);
        } else {
          return next();
        }
      },
      login: function(req, res, success, failure) {
        var cred;
        cred = req.body.user;
        return users.authenticate(cred.name, cred.pass, function(user) {
          var token;
          if (user != null) {
            console.log('login', user);
            token = tokens.create(user.name);
            return initContext(req, res, user, token, success);
          } else {
            return failure();
          }
        });
      },
      reset: function(req, res, user, next) {
        var token;
        token = tokens.create(user.name);
        return initContext(req, res, user, token, next);
      }
    };
  };

}).call(this);

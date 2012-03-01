(function() {

  module.exports = function(app, redis) {
    var COOKIE, cookie, initContext, tokens, users;
    COOKIE = 'logintoken';
    tokens = require('../models/tokens.js')(redis);
    users = require('../models/users.js')(redis);
    cookie = {
      has: function(req) {
        return req.cookies[COOKIE] != null;
      },
      get: function(req) {
        return req.cookies[COOKIE];
      },
      del: function(res) {
        return res.clearCookie(COOKIE);
      },
      put: function(res, data) {
        var opts;
        opts = {
          expires: new Date(Date.now() + 2 * 604800000),
          path: '/'
        };
        return res.cookie(COOKIE, data, opts);
      }
    };
    initContext = function(req, res, user, token, next) {
      return tokens.save(token, function() {
        cookie.put(res, tokens.stringify(token));
        req.session.user = user;
        return next();
      });
    };
    return {
      authenticate: function(req, res, success, failure) {
        var token;
        if (req.session.user) {
          return success();
        } else if (cookie.has(req)) {
          token = tokens.parse(cookie.get(req));
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
        if (cookie.has(req)) {
          token = tokens.parse(cookie.get(req));
          return tokens.remove(token, function() {
            cookie.del(res);
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

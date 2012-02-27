(function() {
  var crypto;

  crypto = require('crypto');

  module.exports = function(redis) {
    var emailLookupKey, encrypt, mksalt, namesKey;
    namesKey = 'usernames';
    emailLookupKey = 'users:lookup:email';
    encrypt = function(text, salt) {
      return crypto.createHmac('sha1', salt).update(text).digest('hex');
    };
    mksalt = function() {
      return Math.round(new Date().valueOf() * Math.random()) + '';
    };
    return {
      authenticate: function(name, pass, callback) {
        return redis.get(name, function(err, res) {
          var auth, user;
          user = JSON.parse(res);
          auth = encrypt(pass, user.salt);
          if (user.pass === auth) {
            return typeof callback === "function" ? callback(user) : void 0;
          } else {
            return typeof callback === "function" ? callback(null) : void 0;
          }
        });
      },
      create: function(name, pass, callback) {
        return redis.sadd(namesKey, name, function(err, res) {
          var salt, user;
          if (res === 0) {
            return typeof callback === "function" ? callback(new Error("A user with name " + name + " already exists"), null) : void 0;
          } else {
            salt = mksalt();
            user = {
              name: name,
              salt: salt,
              pass: encrypt(pass, salt)
            };
            return redis.set(user.name, JSON.stringify(user), function(err, res) {
              return typeof callback === "function" ? callback(null, user) : void 0;
            });
          }
        });
      },
      get: function(name, callback) {
        return redis.get(name, function(err, res) {
          return typeof callback === "function" ? callback(JSON.parse(res)) : void 0;
        });
      }
    };
  };

}).call(this);

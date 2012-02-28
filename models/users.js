(function() {
  var crypto;

  crypto = require('crypto');

  module.exports = function(redis) {
    var encrypt, mksalt, namesKey, usersKey;
    namesKey = 'usernames';
    usersKey = function(name) {
      return "users:" + name;
    };
    encrypt = function(text, salt) {
      return crypto.createHmac('sha1', salt).update(text).digest('hex');
    };
    mksalt = function() {
      return Math.round(new Date().valueOf() * Math.random()) + '';
    };
    return {
      authenticate: function(name, pass, callback) {
        var key;
        key = usersKey(name);
        return redis.get(key, function(err, res) {
          var auth, user;
          if (!(res != null)) {
            return callback(null);
          } else {
            user = JSON.parse(res);
            auth = encrypt(pass, user.salt);
            if (user.pass === auth) {
              return typeof callback === "function" ? callback(user) : void 0;
            } else {
              return typeof callback === "function" ? callback(null) : void 0;
            }
          }
        });
      },
      create: function(name, pass, callback) {
        return redis.sadd(namesKey, name, function(err, res) {
          var key, salt, user;
          if (res === 0) {
            return typeof callback === "function" ? callback(new Error("A user with name " + name + " already exists"), null) : void 0;
          } else {
            salt = mksalt();
            user = {
              name: name,
              salt: salt,
              pass: encrypt(pass, salt)
            };
            key = usersKey(user.name);
            return redis.set(key, JSON.stringify(user), function(err, res) {
              return typeof callback === "function" ? callback(null, user) : void 0;
            });
          }
        });
      },
      get: function(name, callback) {
        var key;
        key = usersKey(name);
        console.log(key);
        return redis.get(key, function(err, res) {
          return typeof callback === "function" ? callback(JSON.parse(res)) : void 0;
        });
      }
    };
  };

}).call(this);

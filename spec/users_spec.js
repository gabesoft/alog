(function() {
  var helper, items, redis, users;

  redis = require('redis').createClient();

  items = require('../models/items.js')(redis);

  users = require('../models/users.js')(redis);

  helper = require('./helper.js')(redis, items, users);

  describe('users', function() {
    var create, mkuser;
    mkuser = function(err, user) {
      return {
        user: user,
        error: err
      };
    };
    create = function(name, pass, callback) {
      return users.create(name, pass, function(err, user) {
        return callback(mkuser(err, user));
      });
    };
    beforeEach(function() {
      return helper.reset();
    });
    it('should create a new user', function() {
      var data, name;
      name = 'jon@email.com';
      data = null;
      create(name, 'secret', function(d) {
        return data = d;
      });
      waitsFor(function() {
        return data != null;
      });
      return runs(function() {
        expect(data.error).toBeNull();
        expect(data.user).toNotBe(null);
        return expect(data.user.name).toEqual(name);
      });
    });
    it('should fail when trying to create a user with an existing user name', function() {
      var first, name, pass;
      name = 'a@b.com';
      pass = 'pass';
      first = null;
      create(name, pass, function(d) {
        return first = d;
      });
      waitsFor(function() {
        return first != null;
      });
      return runs(function() {
        var second;
        second = null;
        create(name, pass, function(d) {
          return second = d;
        });
        waitsFor(function() {
          return second != null;
        });
        return runs(function() {
          expect(second.user).toBeNull();
          return expect(second.error).toNotBe(null);
        });
      });
    });
    it('should authenticate a valid password', function() {
      var data, name, pass;
      name = 'a@b.com';
      pass = 'secret';
      data = null;
      create(name, pass, function(d) {
        return data = d;
      });
      waitsFor(function() {
        return data != null;
      });
      return runs(function() {
        var user;
        user = null;
        users.authenticate(name, pass, function(d) {
          return user = d;
        });
        waitsFor(function() {
          return user != null;
        });
        return runs(function() {
          expect(user).toNotBe(null);
          return expect(user.name).toEqual(name);
        });
      });
    });
    it('should fail to authenticate an invalid password', function() {
      var data, name, pass;
      name = 'a@b.com';
      pass = 'secret';
      data = null;
      create(name, pass, function(d) {
        return data = d;
      });
      waitsFor(function() {
        return data != null;
      });
      return runs(function() {
        var user;
        user = {};
        users.authenticate(name, 'invalid', function(d) {
          return user = d;
        });
        waitsFor(function() {
          return !(user != null);
        });
        return runs(function() {
          return expect(user).toBeNull();
        });
      });
    });
    it('should fail to authenticate an invalid user name', function() {
      var data, name, pass;
      name = 'a@b.com';
      pass = 'secret';
      data = null;
      create(name, pass, function(d) {
        return data = d;
      });
      waitsFor(function() {
        return data != null;
      });
      return runs(function() {
        var user;
        user = {};
        users.authenticate('invalid', pass, function(d) {
          return user = d;
        });
        waitsFor(function() {
          return !(user != null);
        });
        return runs(function() {
          return expect(user).toBeNull();
        });
      });
    });
    it('should get a user by name', function() {
      var data, name, pass;
      name = 'a@b.com';
      pass = 'secret';
      data = null;
      create(name, pass, function(d) {
        return data = d;
      });
      waitsFor(function() {
        return data != null;
      });
      return runs(function() {
        var copy;
        copy = null;
        users.get(name, function(u) {
          return copy = u;
        });
        waitsFor(function() {
          return copy != null;
        });
        return runs(function() {
          return expect(copy).toEqual(data.user);
        });
      });
    });
    return it('should get a user by user name', function() {
      return 0;
    });
  });

}).call(this);

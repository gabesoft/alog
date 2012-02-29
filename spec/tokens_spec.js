(function() {
  var helper;

  helper = require('./helper.js')(require('redis'));

  describe('tokens', function() {
    var redis, tokens;
    tokens = null;
    redis = null;
    beforeEach(function() {
      redis = helper.resetDb();
      return tokens = require('../models/tokens.js')(redis);
    });
    afterEach(function() {
      return helper.closeDb();
    });
    it('should create a new token', function() {
      var name, token;
      name = 'jean';
      token = tokens.create(name);
      return expect(token.name).toEqual(name);
    });
    it('should save a token', function() {
      var name, saved, token, uniq;
      name = 'tok';
      token = tokens.create(name);
      uniq = token.token;
      saved = null;
      tokens.save(token, function(t) {
        return saved = t;
      });
      waitsFor(function() {
        return saved != null;
      });
      return runs(function() {
        expect(saved).toNotBe(null);
        return expect(saved.token).toNotBe(uniq);
      });
    });
    it('should verify a token', function() {
      var name, saved, token, uniq;
      name = 'tok';
      token = tokens.create(name);
      uniq = token.token;
      saved = null;
      tokens.save(token, function(t) {
        return saved = t;
      });
      waitsFor(function() {
        return saved != null;
      });
      return runs(function() {
        var verified;
        verified = null;
        tokens.verify(token, function(t) {
          return verified = t;
        });
        waitsFor(function() {
          return verified != null;
        });
        return runs(function() {
          var invalid;
          invalid = {};
          token.token = uniq;
          tokens.verify(token, function(t) {
            return invalid = t;
          });
          waitsFor((function() {
            return !(invalid != null);
          }));
          return runs(function() {
            expect(verified).toNotBe(null);
            return expect(invalid).toBeNull();
          });
        });
      });
    });
    return it('should delete a token', function() {
      var saved, token;
      token = tokens.create('test');
      saved = null;
      tokens.save(token, function(t) {
        return saved = t;
      });
      waitsFor(function() {
        return saved != null;
      });
      return runs(function() {
        var count;
        count = null;
        tokens.remove(token, function(c) {
          return count = c;
        });
        waitsFor(function() {
          return count != null;
        });
        return runs(function() {
          return expect(count).toBe(1);
        });
      });
    });
  });

}).call(this);

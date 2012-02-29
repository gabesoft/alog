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
    return it('should create a new token', function() {
      var name, token;
      console.log('start');
      name = 'jean';
      token = tokens.create(name);
      return expect(token.name).toEqual(name);
    });
  });

}).call(this);

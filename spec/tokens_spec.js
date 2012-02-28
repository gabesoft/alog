(function() {
  var helper, redis, tokens;

  redis = require('redis').createClient();

  tokens = require('../models/tokens.js')(redis);

  helper = require('./helper.js')(redis, items, users);

  describe('tokens', function() {
    beforeEach(helper.reset);
    it('should create a new token', function() {
      return 0;
    });
    it('should reset a token', function() {
      return 0;
    });
    it('should save a token', function() {
      return 0;
    });
    return it('should get a token', function() {
      return 0;
    });
  });

}).call(this);

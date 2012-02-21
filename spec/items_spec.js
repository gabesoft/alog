(function() {
  var items, redis;

  redis = require('redis').createClient();

  items = require('../models/items.js')(redis);

  describe('items', function() {
    it('should add new item and set the id', function() {
      var item, saved;
      item = {
        text: 'first',
        date: new Date()
      };
      saved = false;
      items.add(item, function(updated) {
        return saved = true;
      });
      waitsFor(function() {
        return saved;
      });
      return runs(function() {
        return expect(item.id).toBeDefined();
      });
    });
    it('should get a range of items', function() {
      var added;
      added = false;
      items.add({
        text: 'fst',
        date: new Date()
      }, (function(item) {
        return added = true;
      }));
      waitsFor(function() {
        return added;
      });
      return runs(function() {
        var all, saved;
        saved = false;
        all = [];
        items.get(0, 5, function(list) {
          saved = true;
          return all = list;
        });
        waitsFor(function() {
          return saved;
        });
        return runs(function() {
          return expect(all.length).toBeGreaterThan(1);
        });
      });
    });
    it('should get all items', function() {
      var all, saved;
      saved = false;
      all = [];
      items.get(0, -1, function(list) {
        saved = true;
        return all = list;
      });
      waitsFor(function() {
        return saved;
      });
      return runs(function() {
        return expect(all.length).toBeGreaterThan(1);
      });
    });
    return it('should get items count', function() {
      var count, run;
      run = false;
      count = -1;
      items.len(function(len) {
        run = true;
        return count = len;
      });
      waitsFor(function() {
        return run;
      });
      return runs(function() {
        console.log(count);
        return expect(count).toBeGreaterThan(-1);
      });
    });
  });

}).call(this);

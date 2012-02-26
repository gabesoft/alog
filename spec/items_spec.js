(function() {
  var helper, items, redis;

  redis = require('redis').createClient();

  items = require('../models/items.js')(redis);

  helper = require('./helper.js')(redis, items);

  describe('items', function() {
    beforeEach(function() {
      return helper.reset();
    });
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
      helper.addItem({
        text: 'fst',
        date: new Date()
      });
      helper.addItem({
        text: 'snd',
        date: new Date()
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
          return expect(all.length).toEqual(2);
        });
      });
    });
    it('should get all items', function() {
      helper.addItem({
        text: 'fst',
        date: new Date()
      });
      helper.addItem({
        text: 'snd',
        date: new Date()
      });
      return runs(function() {
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
          return expect(all.length).toEqual(2);
        });
      });
    });
    return it('should get items count', function() {
      helper.addItem({
        text: 'fst',
        date: new Date()
      });
      helper.addItem({
        text: 'snd',
        date: new Date()
      });
      helper.addItem({
        text: 'trd',
        date: new Date()
      });
      return runs(function() {
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
          return expect(count).toEqual(3);
        });
      });
    });
  });

}).call(this);

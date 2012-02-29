(function() {
  var helper;

  helper = require('./helper.js')(require('redis'));

  describe('items', function() {
    var add, items, redis;
    items = null;
    redis = null;
    beforeEach(function() {
      redis = helper.resetDb();
      return items = require('../models/items.js')(redis).create({
        name: 'test'
      });
    });
    afterEach(function() {
      return helper.closeDb();
    });
    add = function(name, callback) {
      return items.add({
        name: name,
        date: new Date()
      }, callback);
    };
    it('should add new item and set the id', function() {
      var item;
      item = null;
      add('item', function(e) {
        return item = e;
      });
      waitsFor(function() {
        return item != null;
      });
      return runs(function() {
        return expect(item.id).toBeDefined();
      });
    });
    it('should get a range of items', function() {
      var fst, snd;
      fst = null;
      snd = null;
      add('fst', function(e) {
        return fst = e;
      });
      waitsFor(function() {
        return fst != null;
      });
      return runs(function() {
        add('snd', function(e) {
          return snd = e;
        });
        waitsFor(function() {
          return snd != null;
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
    });
    it('should get all items', function() {
      var fst, snd;
      fst = null;
      snd = null;
      add('fst', function(e) {
        return fst = e;
      });
      waitsFor(function() {
        return fst != null;
      });
      return runs(function() {
        add('snd', function(e) {
          return snd = e;
        });
        waitsFor(function() {
          return snd != null;
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
    });
    return it('should get items count', function() {
      var fst, snd, trd;
      fst = null;
      snd = null;
      trd = null;
      add('fst', function(e) {
        return fst = e;
      });
      waitsFor(function() {
        return fst != null;
      });
      return runs(function() {
        add('snd', function(e) {
          return snd = e;
        });
        waitsFor(function() {
          return snd != null;
        });
        return runs(function() {
          add('trd', function(e) {
            return trd = e;
          });
          waitsFor(function() {
            return trd != null;
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
              return expect(count).toEqual(3);
            });
          });
        });
      });
    });
  });

}).call(this);

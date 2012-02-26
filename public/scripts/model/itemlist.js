(function() {
  var model,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  model = require('../model/item.coffee');

  exports.ItemList = (function(_super) {

    __extends(ItemList, _super);

    function ItemList() {
      ItemList.__super__.constructor.apply(this, arguments);
    }

    ItemList.prototype.url = '/items';

    ItemList.prototype.model = model.Item;

    return ItemList;

  })(Backbone.Collection);

}).call(this);

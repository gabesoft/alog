(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  exports.Item = (function(_super) {

    __extends(Item, _super);

    function Item() {
      Item.__super__.constructor.apply(this, arguments);
    }

    Item.prototype.url = '/items';

    return Item;

  })(Backbone.Model);

}).call(this);

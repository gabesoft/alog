(function() {
  var model, view,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  model = require('./model/itemlist.js');

  view = require('./view/logbook.js');

  exports.Router = (function(_super) {

    __extends(Router, _super);

    function Router() {
      Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.routes = {
      '': 'main'
    };

    Router.prototype.main = function() {
      var items, itemsView, socket;
      items = new model.ItemList(express.items);
      itemsView = new view.LogBook({
        model: items,
        el: content
      });
      socket = io.connect();
      return socket.on("items-change-" + express.user, function(data) {
        var existing, item, last;
        switch (data.action) {
          case "add":
            existing = items.get(data.item.id);
            last = items.last();
            if (!((existing != null) || (!((last != null ? last.id : void 0) != null)))) {
              return items.add(data.item);
            }
            break;
          case "del":
            item = items.get(data.item.id);
            if (item != null) return items.remove(item);
        }
      });
    };

    return Router;

  })(Backbone.Router);

}).call(this);

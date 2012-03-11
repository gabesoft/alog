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
        var item;
        switch (data.action) {
          case "add":
            item = (items.get(data.item.id)) || items.last();
            if (!(item != null) || ((item != null ? item.id : void 0) != null)) {
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

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
      socket = io.connect();
      socket.on("items-change-" + express.user, function(data) {
        return console.log(data);
      });
      items = new model.ItemList(express.items);
      return itemsView = new view.LogBook({
        model: items,
        el: content
      });
    };

    return Router;

  })(Backbone.Router);

}).call(this);

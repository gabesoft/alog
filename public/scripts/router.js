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
      'login': 'login',
      'main': 'main',
      '': 'main'
    };

    Router.prototype.main = function() {
      var content, items, itemsView, tmpl;
      tmpl = $('#main-template').template();
      content = $('#content');
      content.html($.tmpl(tmpl));
      items = new model.ItemList();
      return itemsView = new view.LogBook({
        model: items,
        el: content
      });
    };

    Router.prototype.login = function() {
      var content, data, tmpl;
      tmpl = $('#login-template').template();
      content = $('#content');
      data = {
        message: 'Enter your credentials',
        error: 'Invalid password'
      };
      return content.html($.tmpl(tmpl, data));
    };

    return Router;

  })(Backbone.Router);

}).call(this);

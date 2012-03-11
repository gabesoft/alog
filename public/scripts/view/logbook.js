(function() {
  var view,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  view = require('../view/logitem.js');

  exports.LogBook = (function(_super) {

    __extends(LogBook, _super);

    function LogBook() {
      this.addAll = __bind(this.addAll, this);
      this.append = __bind(this.append, this);
      this.prepend = __bind(this.prepend, this);
      this.remove = __bind(this.remove, this);
      LogBook.__super__.constructor.apply(this, arguments);
    }

    LogBook.prototype.events = {
      'keypress #add-item': 'createOnEnter'
    };

    LogBook.prototype.initialize = function() {
      this.input = $('#add-item');
      this.model.each(this.append);
      this.model.bind('add', this.prepend);
      this.model.bind('remove', this.remove);
      return this.model.bind('reset', this.addAll);
    };

    LogBook.prototype.remove = function(item, list, opts) {
      var _ref;
      return (_ref = item.view) != null ? _ref.remove() : void 0;
    };

    LogBook.prototype.prepend = function(item) {
      var itemEl;
      itemEl = $('#item-list');
      return this.addOne(item, itemEl.prepend, itemEl);
    };

    LogBook.prototype.append = function(item) {
      var itemEl;
      itemEl = $('#item-list');
      return this.addOne(item, itemEl.append, itemEl);
    };

    LogBook.prototype.addOne = function(item, addfn, scope) {
      var id, _ref;
      if ((_ref = this.last) != null) _ref.finalize();
      this.last = new view.LogItem({
        model: item,
        input: this.input
      });
      addfn.call(scope, this.last.render().el);
      id = item.get('id');
      if (id == null) this.last.showDelete();
      return this;
    };

    LogBook.prototype.addAll = function() {
      this.model.each(this.append);
      return this;
    };

    LogBook.prototype.createOnEnter = function(e, keyCode) {
      var item, key, text;
      key = keyCode || e.keyCode;
      if (key !== 13) return;
      text = this.input.val();
      if (!text) return;
      item = {
        text: text,
        date: new Date()
      };
      this.model.create(item, {
        wait: false
      });
      return this.input.val('');
    };

    return LogBook;

  })(Backbone.View);

}).call(this);

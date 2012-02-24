(function() {
  var Item, model,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  model = require('../model/item.js');

  Item = (function(_super) {

    __extends(Item, _super);

    function Item() {
      this.repostItem = __bind(this.repostItem, this);
      this.deleteItem = __bind(this.deleteItem, this);
      this.render = __bind(this.render, this);
      Item.__super__.constructor.apply(this, arguments);
    }

    Item.prototype.tagName = 'li';

    Item.prototype.events = {
      'click input.delete': 'deleteItem',
      'click input.repost': 'repostItem'
    };

    Item.prototype.initialize = function(config) {
      this.template = $('#item-template').template();
      return this.input = config.input;
    };

    Item.prototype.render = function() {
      var data, html, json;
      json = this.model.toJSON();
      data = {
        text: json.text,
        date: new Date(json.date).format('dddd, mmmm d hh:MM:ss TT')
      };
      html = $.tmpl(this.template, data);
      $(this.el).html(html);
      return this;
    };

    Item.prototype.deleteItem = function(e) {
      var parent;
      this.model.destroy();
      parent = $(e.target.parentElement);
      return parent.fadeOut(function() {
        return parent.hide();
      });
    };

    Item.prototype.repostItem = function(e) {
      this.input.val(this.model.get('text'));
      return this.input.trigger('keypress', 13);
    };

    return Item;

  })(Backbone.View);

  exports.Items = (function(_super) {

    __extends(Items, _super);

    function Items() {
      this.addAll = __bind(this.addAll, this);
      this.append = __bind(this.append, this);
      this.prepend = __bind(this.prepend, this);
      Items.__super__.constructor.apply(this, arguments);
    }

    Items.prototype.events = {
      'keypress #add-item': 'createOnEnter'
    };

    Items.prototype.initialize = function() {
      this.input = $('#add-item');
      this.model.bind('add', this.prepend);
      this.model.bind('reset', this.addAll);
      return this.model.fetch({
        data: {
          start: 0,
          limit: 10
        }
      });
    };

    Items.prototype.prepend = function(item) {
      var itemEl;
      itemEl = $('#item-list');
      return this.addOne(item, itemEl.prepend, itemEl);
    };

    Items.prototype.append = function(item) {
      var itemEl;
      itemEl = $('#item-list');
      return this.addOne(item, itemEl.append, itemEl);
    };

    Items.prototype.addOne = function(item, addfn, scope) {
      var view;
      view = new Item({
        model: item,
        input: this.input
      });
      addfn.call(scope, view.render().el);
      return this;
    };

    Items.prototype.addAll = function() {
      this.model.each(this.append);
      return this;
    };

    Items.prototype.createOnEnter = function(e, keyCode) {
      var key, text;
      key = keyCode || e.keyCode;
      if (key !== 13) return;
      text = this.input.val();
      if (!text) return;
      this.model.create({
        text: text,
        date: new Date
      });
      return this.input.val('');
    };

    return Items;

  })(Backbone.View);

}).call(this);

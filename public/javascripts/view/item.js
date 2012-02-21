(function() {
  var Item,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Item = (function(_super) {

    __extends(Item, _super);

    function Item() {
      this.render = __bind(this.render, this);
      Item.__super__.constructor.apply(this, arguments);
    }

    Item.prototype.tagName = 'li';

    Item.prototype.className = 'item-show';

    Item.prototype.initialize = function() {
      return this.template = $('#item-template').template();
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
      'keypress #add-item': 'createOnEnter',
      'blur #add-item': 'createOnBlur',
      'click .add-item': 'createOnBlur'
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
      var view;
      view = new Item({
        model: item
      });
      $('#item-list').prepend(view.render().el);
      return this;
    };

    Items.prototype.append = function(item) {
      var view;
      view = new Item({
        model: item
      });
      $('#item-list').append(view.render().el);
      return this;
    };

    Items.prototype.addAll = function() {
      this.model.each(this.append);
      return this;
    };

    Items.prototype.createOnEnter = function(e) {
      var text;
      if (e.keyCode !== 13) return;
      text = this.input.val();
      if (!text) return;
      this.model.create({
        text: text,
        date: new Date
      });
      return this.input.val('');
    };

    Items.prototype.createOnBlur = function(e) {
      return console.log('blur');
    };

    return Items;

  })(Backbone.View);

}).call(this);

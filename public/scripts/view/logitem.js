(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  exports.LogItem = (function(_super) {

    __extends(LogItem, _super);

    function LogItem() {
      this.repostItem = __bind(this.repostItem, this);
      this.deleteItem = __bind(this.deleteItem, this);
      this.render = __bind(this.render, this);
      LogItem.__super__.constructor.apply(this, arguments);
    }

    LogItem.prototype.tagName = 'li';

    LogItem.prototype.events = {
      'click input.delete': 'deleteItem',
      'click input.repost': 'repostItem'
    };

    LogItem.prototype.initialize = function(config) {
      this.template = $('#item-template').template();
      return this.input = config.input;
    };

    LogItem.prototype.getDeleteButton = function() {
      return $(this.el).children('input.delete').first();
    };

    LogItem.prototype.render = function() {
      var data, html, json;
      json = this.model.toJSON();
      data = {
        text: json.text,
        date: new Date(json.date).format('ddd, mm/dd hh:MM:ss TT')
      };
      html = $.tmpl(this.template, data);
      $(this.el).html(html);
      return this;
    };

    LogItem.prototype.deleteItem = function(e) {
      var parent;
      this.model.destroy();
      parent = $(e.target.parentElement);
      return parent.fadeOut(function() {
        return parent.remove();
      });
    };

    LogItem.prototype.repostItem = function(e) {
      this.input.val(this.model.get('text'));
      return this.input.trigger('keypress', 13);
    };

    LogItem.prototype.showDelete = function() {
      var button, hide;
      button = this.getDeleteButton();
      hide = function() {
        return button.fadeOut('slow', function() {
          return button.hide();
        });
      };
      button.fadeIn('slow', function() {
        return _.delay(hide, 40000);
      });
      return this;
    };

    LogItem.prototype.finalize = function() {
      var button;
      button = this.getDeleteButton();
      return button.hide();
    };

    return LogItem;

  })(Backbone.View);

}).call(this);

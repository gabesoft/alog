(function() {
  var model;

  model = require('./model/item.js');

  jQuery(function() {
    var el, item, tmpl;
    item = new model.Item('hola');
    tmpl = $('#item-template').template();
    el = $($.tmpl(tmpl, item.toJSON()));
    return $('#item-list').append(el);
  });

}).call(this);

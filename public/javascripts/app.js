(function() {
  var model;

  model = require('./model/item.js');

  jQuery(function() {
    var el, item, items, tmpl;
    item = new model.Item('hola');
    tmpl = $('#item-template').template();
    el = $($.tmpl(tmpl, item.toJSON()));
    $('#item-list').append(el);
    items = new model.Items();
    return items.fetch({
      data: {
        start: 0,
        limit: 5
      },
      success: function(col, res) {
        return console.log(col.length);
      }
    });
  });

}).call(this);

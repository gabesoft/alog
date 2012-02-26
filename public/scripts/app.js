(function() {
  var model, view;

  model = require('./model/item.js');

  view = require('./view/logbook.js');

  jQuery(function() {
    var items, itemsView;
    items = new model.Items();
    return itemsView = new view.LogBook({
      model: items,
      el: $('#content')
    });
  });

}).call(this);

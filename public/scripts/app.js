(function() {
  var model, view;

  model = require('./model/itemlist.js');

  view = require('./view/logbook.js');

  jQuery(function() {
    var items, itemsView;
    items = new model.ItemList();
    return itemsView = new view.LogBook({
      model: items,
      el: $('#content')
    });
  });

}).call(this);

(function() {
  var model, view;

  model = require('./model/item.js');

  view = require('./view/item.js');

  jQuery(function() {
    var items, itemsView;
    items = new model.Items();
    return itemsView = new view.Items({
      model: items,
      el: $('#content')
    });
  });

}).call(this);

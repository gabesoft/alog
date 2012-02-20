(function() {
  var model;

  model = require('./model/item.js');

  jQuery(function() {
    var item;
    item = new model.Item('hola');
    return console.log('first item', item.toJSON());
  });

}).call(this);

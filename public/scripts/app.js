(function() {
  var model, router, view;

  model = require('./model/itemlist.js');

  view = require('./view/logbook.js');

  router = require('./router.js');

  jQuery(function() {
    new router.Router();
    return Backbone.history.start();
  });

}).call(this);

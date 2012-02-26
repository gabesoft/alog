(function() {
  var router;

  router = require('./router.js');

  jQuery(function() {
    new router.Router();
    return Backbone.history.start();
  });

}).call(this);

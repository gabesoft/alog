(function() {
  var app, express, port, routes;

  express = require('express');

  routes = require('./routes');

  app = module.exports = express.createServer();

  require('./server/config.js')(app, express);

  require('./server/routes.js')(app);

  port = process.env.PORT || 3000;

  app.listen(port, function() {
    return console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
  });

}).call(this);

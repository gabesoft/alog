(function() {
  var app, express, port, routes, stylus;

  express = require('express');

  routes = require('./routes');

  stylus = require('stylus');

  app = module.exports = express.createServer();

  app.configure(function() {
    var RedisStore;
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(stylus.middleware({
      src: __dirname + '/public'
    }));
    RedisStore = require('connect-redis')(express);
    app.use(express.cookieParser());
    app.use(express.session({
      secret: "fancy",
      store: new RedisStore,
      cookie: {
        maxAge: 60000
      }
    }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    return this;
  });

  app.configure('development', function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  app.configure('production', function() {
    return app.use(express.errorHandler());
  });

  app.get('/', function(req, res) {
    req.session.views++;
    return res.render('index', {
      title: req.session.views + ' Views'
    });
  });

  app.get('/item/:id', function(req, res) {
    return res.send('item' + req.params.id);
  });

  port = process.env.PORT || 3000;

  app.listen(port, function() {
    return console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
  });

}).call(this);

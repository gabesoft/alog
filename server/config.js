(function() {

  module.exports = function(app, express) {
    var RedisStore, dbconfig, helper, stylus, url;
    stylus = require('stylus');
    url = require('url');
    helper = require('./helper.js')();
    RedisStore = require('connect-redis')(express);
    dbconfig = helper.parseUrl(process.env.REDISTOGO_URL);
    app.configure(function() {
      app.set('views', __dirname + '/../views');
      app.set('view engine', 'jade');
      app.set('view options', {
        pretty: true,
        layout: true
      });
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      app.use(stylus.middleware({
        src: __dirname + '/../public'
      }));
      app.use(express.cookieParser());
      app.use(express.session({
        secret: "secret",
        store: new RedisStore(dbconfig),
        cookie: {
          maxAge: 60000
        }
      }));
      app.use(app.router);
      return app.use(express.static(__dirname + '/../public'));
    });
    app.configure('test', function() {
      app.use(express.logger());
      app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
      }));
      return app.set('redisdb', 2);
    });
    app.configure('development', function() {
      app.use(express.logger());
      app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
      }));
      return app.set('redisdb', 1);
    });
    app.configure('production', function() {
      app.use(express.logger());
      app.use(express.errorHandler());
      return app.set('redisdb', 0);
    });
    return app.dynamicHelpers({
      session: function(req, res) {
        return req.session;
      },
      flash: function(req, res) {
        return req.flash();
      }
    });
  };

}).call(this);

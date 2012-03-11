module.exports = (app, express) ->
  stylus  = require('stylus')
  url     = require('url')
  helper  = require('./helper.js')()

  RedisStore = require('connect-redis')(express)
  dbconfig   = helper.parseUrl(process.env.REDISTOGO_URL);

  app.configure () ->
    app.set 'views', __dirname + '/../views'
    app.set 'view engine', 'jade'
    app.set 'view options', pretty: true, layout: true
    app.use express.bodyParser()
    app.use express.methodOverride()

    app.use stylus.middleware(src: __dirname + '/../public')
    app.use express.cookieParser()

    app.use express.session(
      secret: "secret"
      store: new RedisStore(dbconfig)
      cookie: { maxAge: 60000 }
    )

    app.use app.router
    app.use express.static(__dirname + '/../public')

  app.configure 'test', () ->
    app.use express.logger()
    app.use express.errorHandler({ dumpExceptions: true, showStack: true })
    app.set 'redisdb', 2

  app.configure 'development', () ->
    app.use express.logger()
    app.use express.errorHandler({ dumpExceptions: true, showStack: true })
    app.set 'redisdb', 1

  app.configure 'production', () ->
    app.use express.logger()
    app.use express.errorHandler()
    app.set 'redisdb', 0

  app.dynamicHelpers
    session: (req, res) ->
      req.session
    flash  : (req, res) ->
      req.flash()

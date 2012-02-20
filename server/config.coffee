module.exports = (app, express) ->
  stylus  = require('stylus')
  url     = require('url')

  RedisStore = require('connect-redis')(express)
  dbconfig   = {}
  if process.env.REDISTOGO_URL
    rurl = url.parse process.env.REDISTOGO_URL
    auth = rurl.auth.split(':')
    dbconfig = 
      host: rurl.hostname
      port: rurl.port
      db  : auth[0]
      pass: auth[1]

  app.configure () ->
    app.set 'views', __dirname + '/../views'
    app.set 'view engine', 'jade'
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

  app.configure 'development', () ->
    app.use express.errorHandler({ dumpExceptions: true, showStack: true })

  app.configure 'production', () ->
    app.use express.errorHandler()


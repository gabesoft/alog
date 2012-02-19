express = require('express')
routes  = require('./routes')
stylus  = require('stylus')
url     = require('url')

app = module.exports = express.createServer()

app.configure () ->
  app.set 'views', __dirname + '/views'
  app.set 'view engine', 'jade'
  app.use express.bodyParser()
  app.use express.methodOverride()

  app.use stylus.middleware(src: __dirname + '/public')

  RedisStore = require('connect-redis')(express)
  app.use express.cookieParser()

  if process.env.REDISTOGO_URL
    rurl = url.parse process.env.REDISTOGO_URL
    auth = rurl.auth.split(':')
    store = new RedisStore(
      host: rurl.hostname
      port: rurl.port
      db  : auth[0]
      pass: auth[1]
    )
  else
    store = new RedisStore()
  app.use express.session(
    secret: "fancy"
    store: store
    cookie: { maxAge: 60000 }
  )

  app.use app.router
  app.use express.static(__dirname + '/public')
  @

app.configure 'development', () ->
  app.use express.errorHandler({ dumpExceptions: true, showStack: true })

app.configure 'production', () ->
  app.use express.errorHandler()

app.get '/', (req, res) ->
  req.session.views++
  res.render 'index', { title: req.session.views + ' Views' }

app.get '/item/:id', (req, res) ->
  res.send('item' + req.params.id)

port = process.env.PORT or 3000
app.listen port, () ->
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env)


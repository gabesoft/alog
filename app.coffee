express = require('express')
routes = require('./routes')

app = module.exports = express.createServer()

app.configure () ->
  app.set 'views', __dirname + '/views'
  app.set 'view engine', 'jade'
  app.use express.bodyParser()
  app.use express.methodOverride()

  #RedisStore = require('connect-redis')(express)
  app.use express.cookieParser()
  app.use express.session({ secret: "fancy" })
  #app.use(express.session({ secret: "fancy", store: new RedisStore }))

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

port = process.env.PORT || 3000
app.listen port, () ->
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env)


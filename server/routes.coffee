module.exports = (app) ->
  TITLE  = 'Log Book'
  redis  = require('redis')
  expose = require('express-expose')
  url    = require('url')

  createRedisClient = () ->
    client = null

    if process.env.REDISTOGO_URL?
      rurl = url.parse process.env.REDISTOGO_URL
      auth = rurl.auth.split(':')
      client = redis.createClient(rurl.port, rurl.hostname)
      client.auth(auth[1])
    else
      client = redis.createClient()

    client.select app.set('redisdb'), (res, err) ->
      console.log res, err

    client

  redisClient = createRedisClient();
  redisClient.on('error', (e) -> console.log e)

  itemsModule = require('../models/items.js')(redisClient)

  auth  = require('./auth')(app, redisClient)
  users = require('../models/users.js')(redisClient)
  items = null

  authenticate = (req, res, next) ->
    success = () ->
      items = itemsModule.create(req.session.user)
      next()
    failure = () ->
      res.redirect '/login'
    auth.authenticate req, res, success, failure

  render = (res, page, layout, title) ->
    res.render page,
      title: TITLE
      titleInfo: title
      layout: "layouts/#{layout}"

  getItems = (start, limit, next) ->
    items.get start, start + limit - 1, next
      
  app.get '/', authenticate, (req, res) ->
    start = 0
    limit = 30
    getItems start, limit, (list) ->
      res.expose items: list
      render res, 'index', 'main', req.session.user.name

  # /items?start=1&limit=3 - returns 3 records starting at index 1 (0 indexed)
  # /items?start=0&limit=0 - returns all records
  app.get '/items', authenticate, (req, res) ->
    start = (Number) req.query.start or 0
    limit = (Number) req.query.limit or 10
    getItems start, limit, (list) ->
      res.send list

  app.post '/items', authenticate, (req, res) ->
    items.add req.body, (item) ->
      res.send(item)

  # only the latest added item can be deleted
  app.delete '/items', authenticate, (req, res) ->
    items.pop (item) ->
      res.send(item)

  app.get '/signup', (req, res) ->
    render res, 'signup', 'login', 'Signup'

  app.get '/logout', (req, res) ->
    auth.logout req, res, () ->
      res.redirect '/login'

  app.get '/login', (req, res) ->
    render res, 'login', 'login', 'Login'

  app.post '/login', (req, res) ->
    success = () -> res.redirect '/'
    failure = () ->
      req.flash('warn', 'login failed')
      res.redirect '/login'
    auth.login req, res, success, failure
  
  # signup and login
  app.post '/users', (req, res) ->
    cred = req.body.user
    if cred.name == ''
      req.flash 'warn', "The user name cannot be blank"
      res.redirect '/signup'
    else if cred.pass == ''
      req.flash 'warn', "Blank passwords are not allowed"
      res.redirect '/signup'
    else if cred.pass != cred.pass2
      req.flash 'warn', "Passwords don't match"
      res.redirect '/signup'
    else
      users.create cred.name, cred.pass, (err, user) ->
        if err?
          req.flash 'warn', err.message
          res.redirect '/signup'
        else
          auth.reset req, res, user, () ->
            res.redirect '/'

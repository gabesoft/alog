module.exports = (app) ->
  redis = require('redis')
  url   = require('url')

  createRedisClient = () ->
    if process.env.REDISTOGO_URL
      rurl = url.parse process.env.REDISTOGO_URL
      auth = rurl.auth.split(':')
      client = redis.createClient(rurl.port, rurl.hostname)
      client.auth(auth[1])
      client
    else
      redis.createClient()

  redisClient = createRedisClient();
  items = require('../models/items.js')(redisClient)

  # sample code: to be removed
  loadItem = (req, res, next) ->
    req.item = items.find req.params.id
    next()

  app.get '/', (req, res) ->
    res.render 'index', title: 'Log Book'

  app.get '/items/:id', loadItem, (req, res) ->
    res.send(req.item)

  # /items?start=1&limit=3 - returns 3 records starting at index 1 (0 indexed)
  # /items?start=0&limit=0 - returns all records
  app.get '/items', (req, res) ->
    start = (Number) req.query.start or 0
    limit = (Number) req.query.limit or 10
    items.get start, start + limit - 1, (list) ->
      res.send(list)

  app.post '/items', (req, res) ->
    items.add req.body, (item) ->
      res.send(item)

  app.delete '/items', (req, res) ->
    items.pop (item) ->
      res.send(item)

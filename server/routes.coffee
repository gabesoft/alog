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

  loadItem = (req, res, next) ->
    req.item = items.find req.params.id
    next()

  app.get '/', (req, res) ->
    req.session.views++
    res.render 'index', { title: req.session.views + ' Views' }

  app.get '/item/:id', loadItem, (req, res) ->
    res.send(req.item)

  app.get '/item', (req, res) ->
    items.getAll (list) ->
      res.send(list)
      redisClient.quit()

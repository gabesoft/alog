module.exports = (app) ->
  redis = require('redis')
  url   = require('url')

  redisClient = () ->
    if process.env.REDISTOGO_URL
      rurl = url.parse process.env.REDISTOGO_URL
      auth = rurl.auth.split(':')
      client = redis.createClient(rurl.port, rurl.hostname)
      client.auth(auth[1])
      client
    else
      redis.createClient()

  items = require('../models/items.js')(redis.createClient())

  loadItem = (req, res, next) ->
    req.item = items.find req.params.id
    next()

  app.get '/', (req, res) ->
    req.session.views++
    res.render 'index', { title: req.session.views + ' Views' }

  app.get '/item/:id', loadItem, (req, res) ->
    res.send(req.item)


module.exports = () ->
  url   = require('url')
  redis = require('redis')
  
  parseUrl: (redisUrl) ->
    if not redisUrl? then return null

    rurl = url.parse redisUrl
    auth = rurl.auth?.split(':')

    host: rurl.hostname
    port: rurl.port
    db  : auth[0]
    pass: auth[1]
    
  redisClient: (db) ->
    config = @parseUrl process.env.REDISTOGO_URL
    client = null

    if config?
      client = redis.createClient(config.port, config.host)
      client.auth(config.pass)
    else
      client = redis.createClient()

    client.select db, (res, err) ->
      console.log res, err
    client.on 'error', (e) ->
      console.log e
      
    client

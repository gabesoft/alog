module.exports = (redis) ->
  resetDb: () ->
    @client = redis.createClient()
    @client.flushdb()
    @client

  closeDb: () ->
    @client.quit()

module.exports = (redis, items, users) ->
  reset: () ->
    redis.flushdb()

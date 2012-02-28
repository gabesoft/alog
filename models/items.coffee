module.exports = (redis) ->
  create: (user) ->
    MAX_ITEMS = 1000
    key = "items:#{user.name}"

    add: (item, callback) ->
      return unless item?
      redis.incr 'item.id', (err, id) ->
        item.id = id
        redis.lpush(key, (JSON.stringify item), () ->
          redis.ltrim(key, 0, MAX_ITEMS, () -> callback? item))

    pop: (callback) ->
      redis.lpop(key, (item) -> callback? item)

    get: (start, end, callback) ->
      redis.lrange key, start, end, (err, reply) ->
        callback?(reply.map JSON.parse)

    len: (callback) ->
      redis.llen key, (err, count) ->
        callback?(count)

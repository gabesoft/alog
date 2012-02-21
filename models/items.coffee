module.exports = (redis) ->
  key = 'items'
  redis.on('error', (e) -> console.log e)

  find: (id) ->
    id: id
    text: 'first item 1'
    date: new Date()

  add: (item, callback) ->
    if item
      redis.incr 'item.id', (err, id) ->
        item.id = id
        redis.lpush(key, JSON.stringify(item))
        if callback
          callback(item)

  get: (start, end, callback) ->
    redis.lrange key, start, end, (err, reply) ->
      if callback
        callback(reply.map JSON.parse)

  len: (callback) ->
    redis.llen key, (err, count) ->
      if callback
        callback(count)

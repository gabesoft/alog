module.exports = (redis, items, users) ->
  reset: () ->
    redis.flushdb()

  addItem: (item) ->
    added = false
    items.add item, () ->
      added = true
    waitsFor () -> added

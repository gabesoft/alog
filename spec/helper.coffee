module.exports = (redis, items) ->
  reset: () ->
    redis.flushdb()

  addItem: (item) ->
    added = false
    items.add item, () ->
      added = true
    waitsFor () -> added

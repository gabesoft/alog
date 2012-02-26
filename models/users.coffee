module.exports = (redis) ->

  authenticate: (name, pass, callback) ->
    callback?({ name: name, id: 10 })

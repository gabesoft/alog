mktoken = () ->
  Math.round(new Date().valueOf() * Math.random()) + ''

reset = (token) ->
  token.token = mktoken()

module.exports = (redis) ->
  save: (token, callback) ->
    reset token
    redis.set "#{token.name}:#{token.id}", JSON.stringify(token), (err, res) ->
      callback(token)

  create: (username, callback) ->
    name  : username
    id    : mktoken()
    token : mktoken()

  parse: JSON.parse
  stringify: JSON.stringify

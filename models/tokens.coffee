mktoken = () ->
  Math.round(new Date().valueOf() * Math.random()) + ''

mkkey = (token) ->
  "#{token.name}:#{token.id}"

module.exports = (redis) ->
  save: (token, callback) ->
    token.token = mktoken()
    redis.set (mkkey token), (JSON.stringify token), (err, res) ->
      callback(token)
  
  remove: (token, callback) ->
    # todo implement
    0

  create: (username) ->
    console.log 'creating'
    name  : username
    id    : mktoken()
    token : mktoken()

  verify: (token, callback) ->
    redis.get (mkkey token), (err, res) ->
      if res?.token == token.token
        callback(res)
      else
        callback(null)
  
  parse: JSON.parse
  stringify: JSON.stringify

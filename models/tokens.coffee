mktoken = () ->
  Math.round(new Date().valueOf() * Math.random()) + ''

mkkey = (token) ->
  "#{token.name}:#{token.id}"

module.exports = (redis) ->
  save: (token, callback) ->
    token.token = mktoken()
    redis.set (mkkey token), (JSON.stringify token), (err, res) ->
      callback token
  
  remove: (token, callback) ->
    redis.del (mkkey token), (err, count) ->
      callback count

  create: (username) ->
    name  : username
    id    : mktoken()
    token : mktoken()

  verify: (token, callback) ->
    redis.get (mkkey token), (err, res) ->
      saved = JSON.parse res
      if saved?.token == token.token
        callback(saved)
      else
        callback(null)
  
  parse: JSON.parse
  stringify: JSON.stringify

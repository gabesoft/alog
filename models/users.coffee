crypto = require('crypto')

module.exports = (redis) ->
  namesKey = 'usernames'
  usersKey = (name) ->
    "users:#{name}"
  
  encrypt = (text, salt) ->
    crypto.createHmac('sha1', salt).update(text).digest('hex')

  mksalt = () ->
    Math.round(new Date().valueOf() * Math.random()) + ''

  authenticate: (name, pass, callback) ->
    key = usersKey name
    redis.get key, (err, res) ->
      if not res?
        callback(null)
      else
        user = JSON.parse res
        auth = encrypt pass, user.salt
        if user.pass == auth
          callback?(user)
        else
          callback?(null)

  create: (name, pass, callback) ->
    redis.sadd namesKey, name, (err, res) ->
      if res == 0
        callback?(new Error("A user with name #{name} already exists"), null)
      else
        salt = mksalt()
        user =
          name: name
          salt: salt
          pass: encrypt(pass, salt)
        key = usersKey user.name
        redis.set key, JSON.stringify(user), (err, res) ->
          callback?(null, user)

  get: (name, callback) ->
    key = usersKey name
    console.log key
    redis.get key, (err, res) ->
      callback?(JSON.parse res)

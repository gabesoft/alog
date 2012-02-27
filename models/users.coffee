crypto = require('crypto')

module.exports = (redis) ->
  namesKey = 'usernames'
  emailLookupKey = 'users:lookup:email'
  
  encrypt = (text, salt) ->
    crypto.createHmac('sha1', salt).update(text).digest('hex')

  mksalt = () ->
    Math.round(new Date().valueOf() * Math.random()) + ''

  authenticate: (name, pass, callback) ->
    redis.get name, (err, res) ->
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
        redis.set user.name, JSON.stringify(user), (err, res) ->
          callback?(null, user)

  get: (name, callback) ->
    redis.get name, (err, res) ->
      callback?(JSON.parse res)

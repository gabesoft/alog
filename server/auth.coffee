module.exports = (app, redis) ->
  COOKIE = 'logintoken'
  tokens = require('../models/tokens.js')(redis)
  users  = require('../models/users.js')(redis)

  initContext = (req, res, user, token, next) ->
    tokens.save token, () ->
      opts =
        expires: new Date(Date.now() + 2 * 604800000)
        path: '/'
      res.cookie COOKIE, (tokens.stringify token), opts
      req.session.user = user
      next()

  authenticate: (req, res, success, failure) ->
    if req.session.user
      success()
    else if req.cookies[COOKIE]?
      token = tokens.parse req.cookies[COOKIE]
      tokens.verify token, (verified) ->
        if verified?
          users.get token.name, (user) ->
            if user?
              initContext req, res, user, token, success
            else
              failure()
        else
          failure()
    else
      failure()
    
  logout: (req, res, next) ->
    if req.cookies[COOKIE]?
      token = tokens.parse req.cookies[COOKIE]
      tokens.remove token, () ->
        res.clearCookie COOKIE
        if req.session?
          req.session.destroy next
        else
          next()
    else if req.session?
      req.session.destroy next
    else
      next()

  login: (req, res, success, failure) ->
    cred = req.body.user
    users.authenticate cred.name, cred.pass, (user) ->
      if user?
        console.log 'login', user
        token = tokens.create user.name
        initContext req, res, user, token, success
      else
        failure()

  reset: (req, res, user, next) ->
    token = tokens.create user.name
    initContext req, res, user, token, next

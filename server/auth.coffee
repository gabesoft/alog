module.exports = (app, redis) ->
  COOKIE = 'logintoken'
  tokens = require('../models/tokens.js')(redis)
  users  = require('../models/users.js')(redis)

  cookie =
    has: (req) -> req.cookies[COOKIE]?
    get: (req) -> req.cookies[COOKIE]
    del: (res) -> res.clearCookie COOKIE
    put: (res, data) ->
      opts =
        expires: new Date(Date.now() + 2 * 604800000)
        path: '/'
      res.cookie COOKIE, data, opts

  initContext = (req, res, user, token, next) ->
    tokens.save token, () ->
      cookie.put res, (tokens.stringify token)
      req.session.user = user
      next()

  authenticate: (req, res, success, failure) ->
    if req.session.user
      success()
    else if cookie.has req
      token = tokens.parse (cookie.get req)
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
    if cookie.has req
      token = tokens.parse (cookie.get req)
      tokens.remove token, () ->
        cookie.del res
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
        token = tokens.create user.name
        initContext req, res, user, token, success
      else
        failure()

  reset: (req, res, user, next) ->
    token = tokens.create user.name
    initContext req, res, user, token, next

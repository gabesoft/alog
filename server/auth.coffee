module.exports = (app, redis) ->
  COOKIE = 'logintoken'
  tokens = require('../models/tokens.js')(redis)
  users  = require('../models/users.js')(redis)

  # TODO: move cookie stuff to cookie helper

  initContext = (req, res, user, token, next) ->
    tokens.save token, () ->
      opts =
        expires: new Date(Date.now() + 2 * 604800000)
        path: '/'
      res.cookie COOKIE, (tokens.stringify token), opts
      req.session.user = user
      console.log 'saved', token
      next()

  toLogin = (res) ->
    res.redirect '/login'

  authenticate: (req, res, next) ->
    console.log 'auth', req.session.user, req.cookies[COOKIE]
    if req.session.user
      next()
    else if req.cookies[COOKIE]?
      token = tokens.parse req.cookies[COOKIE]
      tokens.verify token, (verified) ->
        if verified?
          users.get token.name, (user) ->
            if user?
              initContext req, res, user, token, next
            else
              toLogin res
        else
          toLogin res
    else
      toLogin res
    
  logout: (req, res, next) ->
    #TODO:
    # - remove token
    # - clear cookie
    # - destroy session
    # - use next() for all redirects
    
    if not req.session?
      next()
      return

    if req.cookies[COOKIE]?
      token = tokens.parse req.cookies[COOKIE]
      tokens.remove token, (count) ->
        res.clearCookie COOKIE
        req.session.destroy () ->
          next()
    else
      req.session.destroy () ->
        next()

  login: (req, res, next) ->
    cred = req.body.user
    users.authenticate cred.name, cred.pass, (user) ->
      if user?
        token = tokens.create user.name
        initContext req, res, user, token, next
      else
        req.flash 'warn', 'login failed'
        toLogin res

  reset: (req, res, next) ->
    cred = req.body.user
    users.create cred.name, cred.pass, (err, user) ->
      if err?
        req.flash 'warn', err.message
        res.redirect '/signup'
      else
        token = tokens.create user.name
        initContext req, res, user, token, next

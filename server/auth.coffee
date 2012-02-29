module.exports = (app, redis) ->
  COOKIE = 'logintoken'
  tokens = require('../models/tokens.js')(redis)
  users  = require('../models/users.js')(redis)

  persist = (res, token) ->
    opts =
      expires: new Date(Date.now() + 2 * 604800000)
      path: '/'
    res.cookie COOKIE, (tokens.stringify token), opts

  initContext = (req, res, user, token, next) ->
    req.session.user = user
    tokens.save token, () ->
      persist res, token
      next()

  toLogin = (res) ->
    res.redirect '/login'

  authenticate: (req, res, next) ->
    if req.session.user
      next()
    else if req.cookies.token?
      token = tokens.parse req.cookies.token
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
    if not req.session?
      next()
      return

    if req.session.token?
      token = tokens.parse req.session.token
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
    console.log 'reset'
    cred = req.body.user
    users.create cred.name, cred.pass, (err, user) ->
      console.log 'user created', user, err
      if err?
        req.flash 'warn', err.message
        res.redirect '/signup'
      else
        token = tokens.create user.name
        initContext req, res, user, token, next

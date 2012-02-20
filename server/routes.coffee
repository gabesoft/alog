module.exports = (app) ->
  redis   = require('redis')

  loadItem = (req, res, next) ->
    req.item = 
      id: req.params.id
      text: 'loaded item'
      date: '12/31/1999'
    next()

  app.get '/', (req, res) ->
    req.session.views++
    res.render 'index', { title: req.session.views + ' Views' }

  app.get '/item/:id', loadItem, (req, res) ->
    res.send(req.item)


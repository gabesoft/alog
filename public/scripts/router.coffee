model = require('./model/itemlist.js')
view  = require('./view/logbook.js')

class exports.Router extends Backbone.Router
  routes:
    'login' : 'login'
    'main'  : 'main'
    ''      : 'main'

  main: () ->
    # init html
    tmpl = $('#main-template').template()
    content = $ '#content'
    content.html($.tmpl tmpl)

    # set up models & views
    items = new model.ItemList()
    itemsView = new view.LogBook model: items, el: content

  login: () ->
    # init html
    tmpl = $('#login-template').template()
    content = $ '#content'
    data = { message: 'Enter your credentials', error: 'Invalid password' }
    content.html($.tmpl tmpl, data)

model = require('./model/itemlist.js')
view  = require('./view/logbook.js')

class exports.Router extends Backbone.Router
  routes:
    ''      : 'main'

  main: () ->
    items = new model.ItemList()
    itemsView = new view.LogBook(model: items, el: content)

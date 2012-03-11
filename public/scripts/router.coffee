model = require('./model/itemlist.js')
view  = require('./view/logbook.js')

class exports.Router extends Backbone.Router
  routes:
    ''      : 'main'

  main: () ->
    socket = io.connect()
    socket.on "items-change-#{express.user}", (data) ->
      console.log data

    items = new model.ItemList(express.items)
    itemsView = new view.LogBook(model: items, el: content)

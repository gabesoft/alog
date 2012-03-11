model = require('./model/itemlist.js')
view  = require('./view/logbook.js')

class exports.Router extends Backbone.Router
  routes:
    ''      : 'main'

  main: () ->
    items = new model.ItemList(express.items)
    itemsView = new view.LogBook(model: items, el: content)

    io.configure () ->
      io.set 'transports', ['xhr-polling']
      io.set 'polling duration', 10
    socket = io.connect()
    socket.on "items-change-#{express.user}", (data) ->
      switch data.action
        when "add"
          item = (items.get data.item.id) or items.last()
          items.add data.item if not item? or item?.id?
        when "del"
          item = items.get data.item.id
          items.remove item if item?

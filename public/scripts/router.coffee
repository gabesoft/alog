model = require('./model/itemlist.js')
view  = require('./view/logbook.js')

class exports.Router extends Backbone.Router
  routes:
    ''      : 'main'

  main: () ->
    items = new model.ItemList(express.items)
    itemsView = new view.LogBook(model: items, el: content)

    socket = io.connect()
    socket.on "items-change-#{express.user}", (data) ->
      switch data.action
        when "add"
          existing = items.get data.item.id
          last = items.last()
          items.add data.item unless existing? or (not last?.id?)
        when "del"
          item = items.get data.item.id
          items.remove item if item?

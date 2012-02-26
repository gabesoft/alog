model = require('./model/itemlist.js')
view  = require('./view/logbook.js')

jQuery ->
  items = new model.ItemList()
  itemsView = new view.LogBook model: items, el: $ '#content'

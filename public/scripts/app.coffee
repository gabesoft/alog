model = require('./model/item.js')
view  = require('./view/logbook.js')

jQuery ->
  items = new model.Items()
  itemsView = new view.LogBook model: items, el: $ '#content'

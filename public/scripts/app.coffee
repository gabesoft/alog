model = require('./model/item.js')
view  = require('./view/item.js')

jQuery ->
  items = new model.Items()
  itemsView = new view.Items model: items, el: $ '#content'

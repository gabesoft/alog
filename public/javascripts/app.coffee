model = require('./model/item.js')
view  = require('./view/item.js')

jQuery ->
  items = new model.Items()
  itemsView = new view.Items model: items, el: $ '#content'

  #items.fetch
    #data: { start: 0, limit: 5 }
    #success: (col, res) -> console.log(col.length)

  #item = new model.Item('hola')
  #tmpl = $('#item-template').template()
  #el = $($.tmpl tmpl, item.toJSON())
  #$('#item-list').append(el)

  #items = new model.Items()

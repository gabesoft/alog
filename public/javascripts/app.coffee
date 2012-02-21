model = require('./model/item.js')

jQuery ->
  item = new model.Item('hola')
  tmpl = $('#item-template').template()
  el = $($.tmpl tmpl, item.toJSON())
  $('#item-list').append(el)

  items = new model.Items()
  items.fetch
    data: { start: 0, limit: 5 }
    success: (col, res) -> console.log(col.length)

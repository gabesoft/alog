model = require('./model/item.js')

jQuery ->
  item = new model.Item('hola')
  tmpl = $('#item-template').template()
  el = $($.tmpl tmpl, item.toJSON())
  $('#item-list').append(el)

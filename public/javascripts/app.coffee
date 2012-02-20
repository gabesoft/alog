model = require('./model/item.js')

jQuery ->
  item = new model.Item('hola')
  console.log 'first item', item.toJSON()

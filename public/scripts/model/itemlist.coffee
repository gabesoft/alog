model = require('../model/item.coffee')

class exports.ItemList extends Backbone.Collection
  url: '/items'
  model: model.Item

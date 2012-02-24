class exports.Item extends Backbone.Model
  url: '/items'
  
class exports.Items extends Backbone.Collection
  url: '/items'
  model: exports.Item



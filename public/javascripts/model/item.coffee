class exports.Item extends Backbone.Model
  url: '/items'
  initialize: (text) ->
    this.set 'date': new Date, 'text': text
  



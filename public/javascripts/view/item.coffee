class Item extends Backbone.View
  tagName: 'li'
  className: 'item-show'

  initialize: () ->
    @template = $('#item-template').template()

  render: () =>
    json = @model.toJSON()
    data = 
      text: json.text
      date: new Date(json.date).format('dddd, mmmm d hh:MM:ss TT')
    html = $.tmpl @template, data
    $(@el).html html
    @

class exports.Items extends Backbone.View
  events:
    'keypress #add-item': 'createOnEnter'
    'blur #add-item'    : 'createOnBlur'
    'click .add-item'   : 'createOnBlur'

  initialize: () ->
    # TODO: the input should get its own view
    @input = $ '#add-item'

    @model.bind 'add', @prepend
    @model.bind 'reset', @addAll

    @model.fetch
      data: { start: 0, limit: 10 }

  prepend: (item) =>
    view = new Item model: item
    $('#item-list').prepend view.render().el
    @

  append: (item) =>
    view = new Item model: item
    $('#item-list').append view.render().el
    @

  addAll: () =>
    @model.each @append
    @

  createOnEnter: (e) ->
    if e.keyCode != 13
      return

    text = @input.val()
    if !text
      return

    @model.create text: text, date: new Date
    @input.val('')

  createOnBlur: (e) ->
    # TODO: implement (is this necessary)
    console.log('blur')

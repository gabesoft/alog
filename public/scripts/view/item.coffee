model = require('../model/item.js')

class Item extends Backbone.View
  tagName: 'li'

  events:
    'click input.delete': 'deleteItem',
    'click input.repost': 'repostItem'

  initialize: (config) ->
    @template = $('#item-template').template()
    @input = config.input

  getDeleteButton: () ->
    $(@el).children('input.delete').first()

  render: () =>
    json = @model.toJSON()
    data = 
      text: json.text
      date: new Date(json.date).format('ddd, mm/dd hh:MM:ss TT')
    html = $.tmpl @template, data
    $(@el).html html
    @

  deleteItem: (e) =>
    @model.destroy();

    parent = $(e.target.parentElement)
    parent.fadeOut ->
      parent.remove()

  repostItem: (e) =>
    @input.val(@model.get('text'))
    @input.trigger('keypress', 13);

  showDelete: () ->
    button = @getDeleteButton()
    hide = () ->
      button.fadeOut 'slow', () ->
        button.hide()
    button.fadeIn 'slow', () ->
      _.delay hide, 40000
    @

  finalize: () ->
    button = @getDeleteButton()
    button.hide()

class exports.Items extends Backbone.View
  events:
    'keypress #add-item': 'createOnEnter'

  initialize: () ->
    @input = $ '#add-item'

    @model.bind 'add', @prepend
    @model.bind 'reset', @addAll

    @model.fetch
      data: { start: 0, limit: 50 }

  prepend: (item) =>
    itemEl = $('#item-list')
    @addOne item, itemEl.prepend, itemEl

  append: (item) =>
    itemEl = $('#item-list')
    @addOne item, itemEl.append, itemEl

  addOne: (item, addfn, scope) ->
    @last?.finalize()

    @last = new Item model: item, input: @input
    addfn.call scope, @last.render().el

    id = item.get('id')
    @last.showDelete() unless id?
    @

  addAll: () =>
    @model.each @append
    @

  createOnEnter: (e, keyCode) ->
    key = keyCode or e.keyCode

    if key != 13
      return

    text = @input.val()
    if !text
      return

    @model.create text: text, date: new Date
    @input.val('')

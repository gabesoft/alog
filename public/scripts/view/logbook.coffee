view  = require('../view/logitem.js')

class exports.LogBook extends Backbone.View
  events:
    'keypress #add-item': 'createOnEnter'

  initialize: () ->
    @input = $ '#add-item'
    @model.each @append
    @model.bind 'add', @prepend
    @model.bind 'remove', @remove
    @model.bind 'reset', @addAll

  remove: (item, list, opts) =>
    item.view?.remove()

  prepend: (item) =>
    itemEl = $('#item-list')
    @addOne item, itemEl.prepend, itemEl

  append: (item) =>
    itemEl = $('#item-list')
    @addOne item, itemEl.append, itemEl

  addOne: (item, addfn, scope) ->
    @last?.finalize()

    @last = new view.LogItem model: item, input: @input
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

    item =
      text: text
      date: new Date()
    @model.create item, wait: false
    @input.val('')

view  = require('../view/logitem.js')

class exports.LogBook extends Backbone.View
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

    @last = new view.LogItem model: item, input: @input
    addfn.call scope, @last.render().el

    id = item.get('id')
    @last.showDelete() unless id?
    @

  addAll: () =>
    _delay 10, () ->
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

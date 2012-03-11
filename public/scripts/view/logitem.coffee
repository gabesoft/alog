class exports.LogItem extends Backbone.View
  tagName: 'li'

  events:
    'click input.delete': 'deleteItem',
    'click input.repost': 'repostItem'

  initialize: (config) ->
    @template = $('#item-template').template()
    @input = config.input
    @model.view = @

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

  remove: (el) ->
    el = $(el or @el)
    el.fadeOut () -> el.remove()

  deleteItem: (e) =>
    @model.destroy()
    @remove e.target.parentElement

  repostItem: (e) =>
    @input.val(@model.get('text'))
    @input.trigger('keypress', 13)

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

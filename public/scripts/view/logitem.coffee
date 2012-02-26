class exports.LogItem extends Backbone.View
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

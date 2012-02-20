# TODO: mock redis
redis = require('redis').createClient()
items = require('../models/items.js')(redis)

describe 'items', ->
  it 'should add new item and set the id', ->
    item = 
      text: 'first'
      date: new Date()
    saved = false

    items.add item, (updated) ->
      saved = true
      
    waitsFor(() -> saved)
    runs ->
      expect(item.id).toBeDefined()

  it 'should get a range of items', ->
    items.add(text: 'fst')

    saved = false
    all = []

    items.get 0, 5, (list) ->
      saved = true
      all   = list
    waitsFor(() -> saved)
    runs ->
      expect(all.length).toBeGreaterThan(1)

  it 'should get all items', ->
    saved = false
    all = []

    items.getAll (list) ->
      saved = true
      all   = list

    waitsFor((() -> saved), "timeout exceeded", 1000)
    runs ->
      console.log(all)
      expect(all.length).toBeGreaterThan(1)

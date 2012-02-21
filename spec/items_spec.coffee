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
    waitsFor () -> saved
    runs ->
      expect(all.length).toBeGreaterThan(1)

  it 'should get all items', ->
    saved = false
    all = []

    items.get 0, -1, (list) ->
      saved = true
      all   = list

    waitsFor () -> saved
    runs ->
      expect(all.length).toBeGreaterThan(1)

  it 'should get items count', ->
    run = false
    count = -1

    items.len (len) ->
      run = true
      count = len

    waitsFor ()-> run
    runs ->
      console.log(count)
      expect(count).toBeGreaterThan(-1)

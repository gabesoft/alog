# TODO: mock redis
redis = require('redis').createClient()
items = require('../models/items.js')(redis)
helper = require('./helper.js')(redis, items)

describe 'items', ->
  beforeEach () ->
    helper.reset()

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
    helper.addItem text: 'fst', date: new Date()
    helper.addItem text: 'snd', date: new Date()
    runs ->
      saved = false
      all = []

      items.get 0, 5, (list) ->
        saved = true
        all   = list

      waitsFor () -> saved
      runs ->
        expect(all.length).toEqual(2)

  it 'should get all items', ->
    helper.addItem text: 'fst', date: new Date()
    helper.addItem text: 'snd', date: new Date()

    runs ->
      saved = false
      all = []

      items.get 0, -1, (list) ->
        saved = true
        all   = list

      waitsFor () -> saved
      runs ->
        expect(all.length).toEqual(2)

  it 'should get items count', ->
    helper.addItem text: 'fst', date: new Date()
    helper.addItem text: 'snd', date: new Date()
    helper.addItem text: 'trd', date: new Date()

    runs ->
      run = false
      count = -1

      items.len (len) ->
        run = true
        count = len

      waitsFor ()-> run
      runs ->
        console.log(count)
        expect(count).toEqual(3)

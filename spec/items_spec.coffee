helper = require('./helper.js')(require('redis'))

describe 'items', ->
  items = null
  redis = null

  beforeEach () ->
    redis = helper.resetDb()
    items = require('../models/items.js')(redis).create(name: 'test')

  afterEach () ->
    helper.closeDb()

  add = (name, callback) ->
    items.add { name: name, date: new Date() }, callback

  it 'should add new item and set the id', ->
    item = null
    add 'item', (e) -> item = e

    waitsFor () -> item?
    runs ->
      expect(item.id).toBeDefined()

  it 'should get a range of items', ->
    fst = null
    snd = null

    add 'fst', (e) -> fst = e
    waitsFor () -> fst?

    runs ->
      add 'snd', (e) -> snd = e
      waitsFor () -> snd?

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
    fst = null
    snd = null

    add 'fst', (e) -> fst = e
    waitsFor () -> fst?

    runs ->
      add 'snd', (e) -> snd = e
      waitsFor () -> snd?

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
    fst = null
    snd = null
    trd = null

    add 'fst', (e) -> fst = e
    waitsFor () -> fst?

    runs ->
      add 'snd', (e) -> snd = e
      waitsFor () -> snd?

      runs ->
        add 'trd', (e) -> trd = e
        waitsFor () -> trd?

        runs ->
          run = false
          count = -1

          items.len (len) ->
            run = true
            count = len

          waitsFor ()-> run
          runs ->
            expect(count).toEqual(3)

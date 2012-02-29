helper = require('./helper.js')(require('redis'))

describe 'tokens', ->
  tokens = null
  redis = null

  beforeEach () ->
    redis   = helper.resetDb()
    tokens  = require('../models/tokens.js')(redis)

  afterEach () ->
    helper.closeDb()
  
  it 'should create a new token', () ->
    name  = 'jean'
    token = tokens.create name
    expect(token.name).toEqual name

  #it 'should reset a token', () ->
    #0

  it 'should save a token', () ->
    name  = 'tok'
    token = tokens.create name
    uniq  = token.token

    saved = null
    tokens.save token, (t) -> saved = t
    waitsFor () -> saved?

    runs ->
      expect(saved).toNotBe(null)
      expect(saved.token).toNotBe(uniq)

  it 'should verify a token', () ->
    name  = 'tok'
    token = tokens.create name
    uniq  = token.token
    saved = null

    tokens.save token, (t) -> saved = t
    waitsFor () -> saved?

    runs ->
      verified = null

      tokens.verify token, (t) -> verified = t
      waitsFor () -> verified?

      runs ->
        invalid = {}
        token.token = uniq
        tokens.verify token, (t) -> invalid = t
        waitsFor (() -> not invalid?)

        runs ->
          expect(verified).toNotBe(null)
          expect(invalid).toBeNull()

  it 'should delete a token', () ->
    token = tokens.create 'test'
    saved = null

    tokens.save token, (t) -> saved = t
    waitsFor () -> saved?

    runs ->
      count = null
      tokens.remove token, (c) -> count = c
      waitsFor () -> count?

      runs ->
        expect(count).toBe(1)
    

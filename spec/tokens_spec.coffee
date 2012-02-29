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
    console.log 'start'
    name = 'jean'
    token = tokens.create name
    expect(token.name).toEqual name

  #it 'should reset a token', () ->
    #0

  #it 'should save a token', () ->
    #0

  #it 'should get a token', () ->
    #0

  #it 'should verify a valid token', () ->
    #0

  #it 'should fail to verify an invalid token', () ->
    #0

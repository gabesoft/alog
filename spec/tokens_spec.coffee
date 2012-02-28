redis = require('redis').createClient()
tokens = require('../models/tokens.js')(redis)
helper = require('./helper.js')(redis, items, users)

describe 'tokens', ->
  beforeEach helper.reset
  
  it 'should create a new token', () ->
    0

  it 'should reset a token', () ->
    0

  it 'should save a token', () ->
    0

  it 'should get a token', () ->
    0

  it 'should verify a valid token', () ->
    0

  it 'should fail to verify an invalid token', () ->
    0
    

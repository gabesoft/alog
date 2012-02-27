redis = require('redis').createClient()
items = require('../models/items.js')(redis)
users = require('../models/users.js')(redis)
helper = require('./helper.js')(redis, items, users)

describe 'users', ->
  mkuser = (err, user) ->
    user  : user
    error : err

  create = (name, pass, callback) ->
    users.create name, pass, (err, user) ->
      callback (mkuser err, user)
        

  beforeEach () ->
    helper.reset()

  it 'should create a new user', () ->
    name = 'jon@email.com'
    data = null

    create name, 'secret', (d) -> data = d
    waitsFor () -> data?

    runs ->
      expect(data.error).toBeNull()
      expect(data.user).toNotBe(null)
      expect(data.user.name).toEqual(name)

  it 'should fail when trying to create a user with an existing user name', () ->
    name = 'a@b.com'
    pass = 'pass'
    first = null

    create name, pass, (d) -> first = d
    waitsFor () -> first?

    runs ->
      second = null

      create name, pass, (d) -> second = d
      waitsFor () -> second?

      runs ->
        expect(second.user).toBeNull()
        expect(second.error).toNotBe(null)

  it 'should authenticate a valid password', () ->
    name = 'a@b.com'
    pass = 'secret'
    data = null

    create name, pass, (d) -> data = d
    waitsFor () -> data?

    runs ->
      user = null
      users.authenticate name, pass, (d) -> user = d
      waitsFor () -> user?
      
      runs ->
        expect(user).toNotBe(null)
        expect(user.name).toEqual(name)
  
  it 'should fail to authenticate an invalid password', () ->
    name = 'a@b.com'
    pass = 'secret'
    data = null

    create name, pass, (d) -> data = d
    waitsFor () -> data?

    runs ->
      user = {}
      users.authenticate name, 'invalid', (d) -> user = d
      waitsFor () -> not user?
      
      runs ->
        expect(user).toBeNull()

  it 'should get a user by name', () ->
    name = 'a@b.com'
    pass = 'secret'
    data = null

    create name, pass, (d) -> data = d
    waitsFor () -> data?

    runs ->
      copy = null
      users.get name, (u) -> copy = u
      waitsFor () -> copy?

      runs -> expect(copy).toEqual(data.user)

  it 'should get a user by user name', () ->
    0

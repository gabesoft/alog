router = require('./router.js')

jQuery ->
  new router.Router()
  Backbone.history.start()

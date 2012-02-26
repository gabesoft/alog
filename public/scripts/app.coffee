model = require('./model/itemlist.js')
view  = require('./view/logbook.js')

router = require('./router.js')

jQuery ->
  new router.Router()
  Backbone.history.start()

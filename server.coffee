express = require('express')

app = module.exports = express.createServer()

require('./server/config.js')(app, express)
require('./server/routes.js')(app)

port = process.env.PORT or 3000
app.listen port, () ->
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env)

bundle = require('browserify') __dirname + '/public/scripts/app.js',
  debug: false
  mount: '/all.js'

app.use bundle


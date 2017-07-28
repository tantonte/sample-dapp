const app = require('express')()
var server = require('http').createServer(app)
var bodyParser = require('body-parser')
var dapp = require('./dapp.js')

dapp.initializeDapp(ready)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(dapp.contracts)

function ready () {
  var port = process.env.PORT || 4500
  server.listen(port)
  console.log('server listen on port ' + port + ' . . . . . .')
}

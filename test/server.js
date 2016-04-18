// This is the server run by devtron in debug mode.
// It allows you to run devtron in a browser and have it forward requests
// to the running Electron app.

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const vm = require('vm')

console.log('Starting Devtron server')

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.post('/', function (request, response) {
  try {
    response.json({result: vm.runInThisContext(request.body.expression)})
  } catch (error) {
    response.json(error)
  }
})
app.listen(3000, 'localhost', function () {
  console.log('Devtron server listening on http://localhost:3000')
})

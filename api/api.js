const api = require('express').Router()
const test = require('./test')

api.use('/test', test)

module.exports = api
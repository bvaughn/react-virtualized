var jsdom = require('jsdom').jsdom

var exposedProperties = ['window', 'navigator', 'document']

global.document = jsdom('')
global.window = document.defaultView

Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property)
    global[property] = document.defaultView[property]
  }
})

global.navigator = {
  userAgent: 'node.js'
}

// Overwrite global.Promise with Bluebird
// Replace the scheduler with setImmediate so we can write sync tests
import Bluebird from 'bluebird'
Bluebird.setScheduler(fn => {
  global.setImmediate(fn)
})
global.Promise = Bluebird

// Reference: https://babeljs.io/docs/usage/polyfill/
// Reference: https://github.com/zloirock/core-js
// Polyfill a full ES6 environment
import 'babel-polyfill'

var glob = require('glob')
glob('source/**/*.test.js', {}, function (data, files) {
  files.forEach(function (file) {
    require(file.replace('source/', './'))
  })
})

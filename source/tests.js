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

// Reference: https://github.com/webpack/karma-webpack#alternative-usage
const tests = require.context('.', true, /\.test\.(js|jsx)$/)
tests.keys().forEach(tests)

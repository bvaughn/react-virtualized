require('babel/register')

var ghpages = require('gh-pages')
var config = require('../webpack.config.demo.js')

main()

function main () {
  ghpages.publish(
    config.output.path,
    console.error.bind(console)
  )
}

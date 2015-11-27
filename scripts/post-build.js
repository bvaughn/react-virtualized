var fs = require('fs-extra')
var path = require('path')
var replace = require('replace')

const source = path.resolve(__dirname, '../index.html')
const dest = path.resolve(__dirname, '../build/index.html')

fs.copySync(source, dest)

replace({
    regex: /script src="[^"]+"/,
    replacement: 'script src="demo.js"',
    paths: [dest],
    recursive: false,
    silent: true,
});

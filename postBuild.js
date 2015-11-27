var fs = require('fs-extra')
var path = require('path')
var replace = require('replace')

fs.copySync(path.resolve(__dirname, 'index.html'), 'build/index.html')

replace({
    regex: /script src="[^"]+"/,
    replacement: 'script src="demo.js"',
    paths: ['build/index.html'],
    recursive: false,
    silent: true,
});

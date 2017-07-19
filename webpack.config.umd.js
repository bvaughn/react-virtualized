const path = require('path')
const webpack = require('webpack')

module.exports = {
  resolveLoader: {
    moduleExtensions: ["-loader"]
  },
  devtool: 'source-map',
  entry: {
    'react-virtualized': './source/index.js'
  },
  output: {
    path: path.join(__dirname, 'dist/umd'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'ReactVirtualized'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      beautify: true,
      comments: true,
      mangle: false
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'source')
      }
    ]
  }
}

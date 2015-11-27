const path = require('path')
const webpack = require('webpack')

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client',
    './source/demo'
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'demo.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'source')
      },
      {
        test: /\.less$/,
        loaders: ['style', 'css', 'less'],
        include: path.join(__dirname, 'source')
      }
    ]
  }
}

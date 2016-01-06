const autoprefixer = require('autoprefixer')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  devtool: 'source-map',
  entry: {
    'react-virtualized': './source/index.js'
  },
  output: {
    path: 'dist',
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'react-virtualized'
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React'
    }
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
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css?modules&importLoaders=1', 'postcss'],
        include: path.join(__dirname, 'source')
      }
    ]
  },
  postcss: function () {
    return [autoprefixer]
  }
}

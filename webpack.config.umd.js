const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  devtool: 'source-map',
  entry: {
    'react-virtualized': './source/index.js'
  },
  output: {
    path: 'dist/umd',
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'ReactVirtualized'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-addons-shallow-compare': 'var React.addons.shallowCompare'
  },
  plugins: [
    new ExtractTextPlugin('../styles.css', {
      allChunks: false,
      beautify: true,
      mangle: false
    }),
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
        loader: ExtractTextPlugin.extract('css-loader!autoprefixer-loader?{browsers:["last 2 version", "Firefox 15"]}'),
        include: path.join(__dirname, 'source')

      }
    ]
  }
}

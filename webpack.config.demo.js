const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  devtool: 'source-map',
  entry: {
    demo: './source/demo/index'
  },
  output: {
    path: 'build',
    filename: 'static/[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true,
      template: './index.html'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
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
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css?importLoaders=1'],
        include: path.join(__dirname, 'styles.css')
      }
    ]
  },
  postcss: function () {
    return [autoprefixer]
  }
}

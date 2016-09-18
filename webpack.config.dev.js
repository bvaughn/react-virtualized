const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const path = require('path')
const webpack = require('webpack')

const config = {
  devtool: 'eval',
  entry: {
    demo: './source/demo/index'
  },
  output: {
    path: 'build',
    filename: '/static/[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true,
      template: './index.html'
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin()
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
  },
  devServer: {
    contentBase: 'build',
    port: 3001,
    quiet: true
  }
}

if (process.env.NODE_ENV === 'development') {
  const Dashboard = require('webpack-dashboard')
  const DashboardPlugin = require('webpack-dashboard/plugin')
  const dashboard = new Dashboard()

  config.plugins.push(
    new DashboardPlugin(dashboard.setData)
  )
}

module.exports = config

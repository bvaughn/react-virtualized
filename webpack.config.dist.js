const autoprefixer = require('autoprefixer')
const path = require('path')

require('webpack')

module.exports = {
  devtool: 'source-map',
  entry: ['./source/index'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'react-virtualized.js',
    publicPath: '/static/',
    libraryTarget: 'umd',
    library: 'react-virtualized',
    sourceMapFilename: 'react-virtualized.js.map'
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
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'source'),
        exclude: /(node_modules)/
      },
      {
        test: /\.less$/,
        loaders: ['style', 'css', 'postcss', 'less'],
        include: path.join(__dirname, 'source'),
        exclude: /(node_modules)/
      }
    ]
  },
  postcss: [
    autoprefixer({ browsers: ['last 2 versions'] })
  ]
}

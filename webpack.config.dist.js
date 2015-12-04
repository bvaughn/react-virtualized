const autoprefixer = require('autoprefixer')
const path = require('path')

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
    },
    'react-dom': {
      'commonjs': 'react-dom',
      'commonjs2': 'react-dom',
      'amd': 'react-dom',
      'root': 'ReactDOM'
    }
  },
  plugins: [
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
        loaders: ['style', 'css', 'postcss', 'less'],
        include: path.join(__dirname, 'source')
      }
    ]
  },
  postcss: [
    autoprefixer({ browsers: ['last 2 versions'] })
  ]
}

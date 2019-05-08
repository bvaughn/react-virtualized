module.exports = {
  autoprefixer: {
    browsers: ['last 2 version', 'Firefox 15', 'iOS 8'],
  },
  // The plugins section is used by postcss-loader with webpack
  plugins: [require('autoprefixer')],
};

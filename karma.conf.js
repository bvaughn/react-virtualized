module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    files: ['source/tests.js'],
    preprocessors: {
      'source/tests.js': ['webpack', 'sourcemap']
    },
    junitReporter: {
      outputDir: (process.env.CIRCLE_TEST_REPORTS || 'public') + '/karma',
      suite: 'karma'
    },
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },
    singleRun: true,
    plugins: [
      require('karma-coveralls'),
      require('karma-coverage'),
      require('karma-jasmine'),
      require('karma-webpack'),
      require('karma-spec-reporter'),
      require('karma-junit-reporter'),
      require('karma-sourcemap-loader'),
      require('karma-phantomjs-launcher')
    ],
    reporters: ['coverage', 'coveralls'],
    webpack: require('./webpack.config.dev')
  })
}

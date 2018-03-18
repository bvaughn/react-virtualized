  const env = process.env.NODE_ENV;

if (env === 'commonjs' || env === 'es') {
  module.exports = {
    ignore: [
      '*.jest.js',
      '*.e2e.js',
      '*.ssr.js',
      '*.example.js',
      'source/demo',
      'source/jest-*.js',
      'source/TestUtils.js',
    ],
    plugins: [
      'transform-runtime',
      ['flow-react-proptypes', {deadCode: true, useESModules: true}],
      ['transform-react-remove-prop-types', {mode: 'wrap'}],
    ],
    presets: [['env', {modules: false}], 'react', 'flow', 'stage-2'],
  };

  if (env === 'commonjs') {
    module.exports.plugins.push('transform-es2015-modules-commonjs');
  }
}

if (env === 'development') {
  module.exports = {
    presets: ['react', 'flow', 'stage-2'],
  };
}

if (env === 'production') {
  module.exports = {
    comments: false,
    plugins: ['transform-runtime'],
    presets: ['env', 'react', 'flow', 'stage-2'],
  };
}

if (env === 'test') {
  module.exports = {
    comments: false,
    plugins: ['transform-es2015-modules-commonjs'],
    presets: ['react', 'flow', 'stage-2'],
  };
}

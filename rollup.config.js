import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  input: './source/index.js',
  output: {
    file: 'dist/umd/react-virtualized.js',
    format: 'umd',
    name: 'ReactVirtualized',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  },
  external: ['react', 'react-dom'],
  plugins: [
    nodeResolve(),
    commonjs({
      include: 'node_modules/**',
    }),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
    uglify({
      mangle: false,
      output: {
        comments: true,
        beautify: true,
      },
    }),
  ],
};

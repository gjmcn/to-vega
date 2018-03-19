import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

export default {
  input: 'index',
  output: {
    extend: true,
    file: 'dist/index.js',
    format: 'umd',
    name: 'tv'
  },
  plugins: [
    uglify(),
    commonjs({
      sourceMap: false
    })
  ]
};
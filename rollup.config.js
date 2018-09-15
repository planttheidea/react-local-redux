import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import {uglify} from 'rollup-plugin-uglify';

export default [
  {
    external: ['react', 'redux'],
    input: 'src/index.js',
    output: {
      exports: 'named',
      file: 'dist/react-local-redux.js',
      format: 'umd',
      globals: {
        react: 'React',
        redux: 'Redux',
      },
      name: 'ReactLocalRedux',
      sourcemap: true,
    },
    plugins: [
      commonjs({
        include: 'node_modules/**',
      }),
      resolve({
        main: true,
        module: true,
      }),
      babel({
        exclude: 'node_modules/**',
      }),
    ],
  },
  {
    external: ['react', 'redux'],
    input: 'src/index.js',
    output: {
      exports: 'named',
      file: 'dist/react-local-redux.min.js',
      format: 'umd',
      globals: {
        react: 'React',
        redux: 'Redux',
      },
      name: 'ReactLocalRedux',
    },
    plugins: [
      commonjs({
        include: 'node_modules/**',
      }),
      resolve({
        main: true,
        module: true,
      }),
      babel({
        exclude: 'node_modules/**',
      }),
      uglify(),
    ],
  },
];

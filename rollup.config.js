import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

const external = ['@statirjs/core'];

const globals = {
  core: 'core'
};

export default [
  {
    input: 'src/index.ts',
    output: {
      globals,
      file: 'build/es/index.js',
      format: 'es'
    },
    external,
    plugins: [
      typescript({
        declaration: false
      })
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      globals,
      file: 'build/es/index.mjs',
      format: 'es'
    },
    external,
    plugins: [
      typescript({
        declaration: false
      }),
      terser()
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      globals,
      file: 'build/cjs/index.js',
      format: 'cjs'
    },
    external,
    plugins: [
      typescript({
        declaration: false
      })
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      globals,
      file: 'build/umd/index.js',
      format: 'umd',
      name: 'statirjs'
    },
    external,
    plugins: [
      typescript({
        declaration: false
      })
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      globals,
      file: 'build/umd/index.min.js',
      format: 'umd',
      name: 'statirjs'
    },
    external,
    plugins: [
      typescript({
        declaration: false
      }),
      terser()
    ]
  }
];

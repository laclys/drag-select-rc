import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import filesize from 'rollup-plugin-filesize'
import commonjs from 'rollup-plugin-commonjs'

export default {
  plugins: [
    resolve(),
    commonjs({
      // All of our own sources will be ES6 modules, so only node_modules need to be resolved with cjs
      include: 'node_modules/**',
      namedExports: {
        'src/index.ts': [
          'clone'
        ]
      },
    }),
    filesize(),
    typescript()
  ],
  input: 'src/index.ts',
  external: [
    'react',
  ],
  output: [
    // 输出 es module 模块
    {
      sourcemap: true,
      file: './lib/es/index.js',
      format: 'es'
    },
    // 输出 commonJS 模块
    {
      sourcemap: true,
      file: './lib/es5/index.js',
      format: 'cjs'
    }
  ]
};
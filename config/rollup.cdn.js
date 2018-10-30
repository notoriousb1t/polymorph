
import typescript from 'rollup-plugin-typescript';
import nodeResolve from 'rollup-plugin-node-resolve';

module.exports = {
  input: 'src/index.ts',
  output: {
    file: 'dist/polymorph.js',
    format: 'umd',
    name: 'polymorph'
  },
  plugins: [
    typescript({
      tsconfig: false,
      target: 'es5',
      rootDir: 'src',
      module: 'es2015',
      preserveConstEnums: false,
      removeComments: true,
      declaration: false,
      typescript: require('typescript'),
      noImplicitAny: true
    }),
    nodeResolve({
      module: true,
      jsnext: true,
      main: true,
      browser: true,
      extensions: [ '.js', '.json' ],
      preferBuiltins: false
    })
  ]
}

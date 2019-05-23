import babel from 'rollup-plugin-babel'
import pkg from './package.json'

export default {
  input: 'src/index.js',
  output: {
    format: 'es',
    indent: false,
    file: 'es/index.js',
    external: Object.keys(pkg.peerDependencies || {})
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}

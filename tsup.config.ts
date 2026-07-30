import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: 'es2019',
  // react is a peer dependency; bundling it would give consumers a second
  // copy and the "Invalid hook call" error
  external: ['react', 'react-dom']
})

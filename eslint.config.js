import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    '**/*.gen.ts',
    '.github',
  ],
})

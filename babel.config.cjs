// babel.config.cjs
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }]
    // If you use TypeScript, you might have '@babel/preset-typescript' here too
  ],
  plugins: [
    '@babel/plugin-syntax-import-meta',
    "babel-plugin-transform-import-meta"
  ]
};
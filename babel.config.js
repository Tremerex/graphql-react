'use strict';

module.exports = (api) => (
  api.cache(true),
  {
    presets: [
      '@babel/react',
      ['@babel/env', {
        modules: 'commonjs',
        loose: true,
        targets: {
          chrome: 71
        }
      }]
    ],
    plugins: [
      // Stage 1
      "@babel/plugin-proposal-export-default-from",
      "@babel/plugin-proposal-logical-assignment-operators",
      ["@babel/plugin-proposal-optional-chaining", { "loose": false }],
      ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
      ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }],
      "@babel/plugin-proposal-do-expressions",
      "@babel/syntax-dynamic-import",
      "@babel/plugin-transform-runtime",
      "@loadable/babel-plugin"
    ],
    ignore: [
      '/node_modules/',
      '/build/',
      '/public/',
      '/config/'
    ],
    sourceMaps: false,
    comments: true,
    compact: true
  }
);

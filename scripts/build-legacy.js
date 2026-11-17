'use strict';

const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const root = path.join(__dirname, '..');
const assetsDir = path.join(root, 'assets');
const indexPath = path.join(root, 'index.html');
const html = fs.readFileSync(indexPath, 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);

if (!scriptMatch) {
  throw new Error('No inline game script found in index.html');
}

const transformed = babel.transformSync(scriptMatch[1], {
  babelrc: false,
  configFile: false,
  sourceType: 'script',
  comments: false,
  compact: false,
  presets: [[require.resolve('@babel/preset-env'), {
    targets: { chrome: '30' },
    modules: false,
    useBuiltIns: false
  }]]
});

const code = transformed.code || '';
const forbidden = [
  ['const/let', /\b(?:const|let)\s+[A-Za-z_$]/],
  ['arrow function', /=>/],
  ['async/await', /\b(?:async\s+function|await\s+[A-Za-z_$({])/],
  ['for...of', /\bfor\s*\(\s*(?:var\s+)?[A-Za-z_$][\w$]*\s+of\s+/],
  ['template literal', /`/]
];

for (let i = 0; i < forbidden.length; i++) {
  const match = code.match(forbidden[i][1]);
  if (match) {
    throw new Error('Legacy build still contains ' + forbidden[i][0] + ': ' + match[0]);
  }
}

const polyfillSources = [
  path.join(path.dirname(require.resolve('core-js-bundle')), 'minified.js'),
  require.resolve('regenerator-runtime/runtime.js'),
  require.resolve('whatwg-fetch/dist/fetch.umd.js'),
  path.join(assetsDir, 'legacy-extra.js')
];

const polyfills = polyfillSources.map(function (file) {
  return fs.readFileSync(file, 'utf8');
}).join('\n;\n');

fs.writeFileSync(path.join(assetsDir, 'app.es5.js'), code + '\n');
fs.writeFileSync(path.join(assetsDir, 'legacy-polyfills.js'), polyfills + '\n');

const legacyHtml = html
  .replace('</head>', '  <link rel="stylesheet" href="/assets/legacy-fallbacks.css">\n</head>')
  .replace(/<script>[\s\S]*?<\/script>/, '<script src="/assets/legacy-polyfills.js"></script>\n<script src="/assets/app.es5.js"></script>');

fs.writeFileSync(path.join(root, 'index.legacy.html'), legacyHtml);
process.stdout.write('Legacy build written: index.legacy.html, assets/app.es5.js, assets/legacy-polyfills.js\n');

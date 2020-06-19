const path = require('path');
const pluginTester = require('babel-plugin-tester').default;
const plugin = require('../src/transforms/var-to-func.transform');

pluginTester({
  plugin,
  fixtures: path.join(__dirname, 'fixtures', 'var-to-func')
});

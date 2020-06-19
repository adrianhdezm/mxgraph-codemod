const path = require('path');
const pluginTester = require('babel-plugin-tester').default;
const plugin = require('../src/transforms/proto-to-class.transform');

pluginTester({
  plugin,
  fixtures: path.join(__dirname, 'fixtures', 'proto-to-class')
});

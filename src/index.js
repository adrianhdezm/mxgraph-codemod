const fs = require('fs');
const _ = require('lodash');
const babel = require('@babel/core');
const { getAllJSFiles } = require('./helpers/file.helpers');
const protoToClass = require('./transforms/proto-to-class.transform');
const varToFunction = require('./transforms/var-to-func.transform');

const srcRoot = process.argv[2];
if (!_.isEmpty(srcRoot) && fs.existsSync(srcRoot)) {
  const files = getAllJSFiles(srcRoot);

  files.forEach((file) => {
    const code = fs.readFileSync(file, 'utf8');
    const output = babel.transformSync(code, {
      plugins: [varToFunction, protoToClass]
    });
    if (output.code) {
      fs.writeFileSync(file, output.code);
    } else {
      console.log(`Error: No output for file: '${file}'`);
    }
  });
} else {
  console.log(`Error: The path: '${srcRoot}' is invalid!`);
}

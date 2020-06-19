const fs = require('fs');
const path = require('path');

function getAllJSFiles(dir) {
  return fs
    .readdirSync(dir)
    .reduce((files, file) => {
      const name = path.join(dir, file);
      const isDirectory = fs.statSync(name).isDirectory();
      return isDirectory ? [...files, ...getAllJSFiles(name)] : [...files, name];
    }, [])
    .filter((file) => file.split('/').pop().split('.').pop() === 'js');
}

module.exports = {
  getAllJSFiles
};

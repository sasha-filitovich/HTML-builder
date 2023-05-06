const fs = require('fs');
const path = require('path');
let arr = [];
fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  else
    files.forEach((file) => {
      if (file.isFile() && path.extname(path.join(__dirname, 'styles', file.name)) === '.css') {
        fs.readFile(path.join(__dirname, 'styles', file.name), 'utf-8', (err, data) => {
          if (err) console.log(err);
          else {
            arr.push(data);
          }
        });
      }
      console.log(arr);
    });
});
const str = arr.join('\n');

fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), str, (err) => {
  if (err) throw err;
});

const fs = require('fs');
const path = require('path');

fs.promises
  .readdir(path.join(__dirname, 'styles'), { withFileTypes: true })
  .then((files) =>
    Promise.all(
      files
        .filter(
          (file) =>
            file.isFile() && path.extname(path.join(__dirname, 'styles', file.name)) === '.css'
        )
        .map((file) => fs.promises.readFile(path.join(__dirname, 'styles', file.name), 'utf-8'))
    )
  )
  .then((data) => {
    fs.promises.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), data.join('\n'));
  });

const fs = require('fs/promises');
const path = require('path');

fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true })
  .then(() => fs.readdir(path.join(__dirname, 'files-copy')))
  .then((files) =>
    Promise.all(files.map((file) => fs.rm(path.join(__dirname, 'files-copy', file))))
  )
  .then(() => fs.readdir(path.join(__dirname, 'files')))
  .then((files) =>
    Promise.all(
      files.map((file) =>
        fs.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file))
      )
    )
  );

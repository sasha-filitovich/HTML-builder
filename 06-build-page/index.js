const fs = require('fs');
const path = require('path');
let template;
let fileNames = [];
let componentsObj = {};
fs.promises
  .readFile(path.join(__dirname, 'template.html'), 'utf-8')
  .then((data) => (template = data))
  .then(() => fs.promises.readdir(path.join(__dirname, 'components'), { withFileTypes: true }))
  .then((files) => {
    fileNames = files
      .filter(
        (file) =>
          file.isFile() && path.extname(path.join(__dirname, 'components', file.name)) === '.html'
      )
      .map((file) => file.name);
    return Promise.all(
      files
        .filter(
          (file) =>
            file.isFile() && path.extname(path.join(__dirname, 'components', file.name)) === '.html'
        )
        .map((file) => fs.promises.readFile(path.join(__dirname, 'components', file.name), 'utf-8'))
    );
  })
  .then((data) => {
    fileNames.forEach((el, index) => {
      const name = el.split('.')[0];
      componentsObj[name] = data[index];
    });
  })
  .then(() => {
    for (const key in componentsObj) {
      template = template.replace(`{{${key}}}`, componentsObj[key]);
    }
  })
  .then(() => fs.promises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }))
  .then(() => fs.promises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), template))

  .then(() => fs.promises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true }))
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
    fs.promises.writeFile(path.join(__dirname, 'project-dist', 'style.css'), data.join('\n'));
  })
  .then(() => deleteDir(path.join(__dirname, 'project-dist', 'assets')))
  .then(() =>
    copyFile(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'))
  );

function deleteDir(dir) {
  return fs.promises.readdir(dir, { withFileTypes: true }).then(
    (files) => {
      if (!files.length) {
        return fs.promises.rmdir(dir);
      } else {
        return Promise.all(
          files.map((file) => {
            if (file.isFile()) {
              return fs.promises.rm(path.join(dir, file.name));
            } else {
              return deleteDir(path.join(dir, file.name));
            }
          })
        ).then(() => deleteDir(dir));
      }
    },
    () => {}
  );
}
function copyFile(dir, destination) {
  fs.promises.readdir(dir, { withFileTypes: true }).then((files) => {
    console.log(files);
    for (let file of files) {
      if (!file.isFile()) {
        fs.promises
          .mkdir(path.join(destination, file.name), {
            recursive: true,
          })
          .then(() => copyFile(path.join(dir, file.name), path.join(destination, file.name)));
      } else {
        fs.promises.copyFile(path.join(dir, file.name), path.join(destination, file.name));
      }
    }
  });
}

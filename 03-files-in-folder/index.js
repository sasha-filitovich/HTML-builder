const fs = require('fs');
const path = require('path');
fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  else
    files.forEach((file) => {
      if (file.isFile()) {
        const filePath = path.join(__dirname, 'secret-folder', file.name);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error(err);
            return;
          }
          const nameArr = path.basename(filePath).split('.');
          console.log(`${nameArr[0]} - ${path.extname(filePath).slice(1)} - ${stats.size}b`);
        });
      }
    });
});

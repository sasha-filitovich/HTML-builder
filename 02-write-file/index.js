const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
fs.writeFile(path.join(__dirname, 'text.txt'), '', (err) => {
  if (err) throw err;
});
console.log('Введите текст:');
stdin.on('data', (data) => {
  const dataStr = data.toString();
  if (dataStr.trim() == 'exit') {
    process.exit();
  }
  fs.appendFile(path.join(__dirname, 'text.txt'), dataStr, (err) => {
    if (err) throw err;
  });
});
process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('Удачи в изучении Node.js!'));

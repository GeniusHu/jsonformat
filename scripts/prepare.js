const fs = require('fs-extra');
const path = require('path');

// 确保目标目录存在
fs.ensureDirSync('public/assets/codemirror');
fs.ensureDirSync('public/assets/libs');
fs.ensureDirSync('public/assets/css');

// 复制 CodeMirror 文件
fs.copySync(
  'node_modules/codemirror/lib',
  'public/assets/codemirror/lib'
);
fs.copySync(
  'node_modules/codemirror/mode',
  'public/assets/codemirror/mode'
);
fs.copySync(
  'node_modules/codemirror/addon',
  'public/assets/codemirror/addon'
);

// 复制其他依赖
fs.copySync(
  'node_modules/jsonlint-mod/web/jsonlint.js',
  'public/assets/libs/jsonlint.js'
);

// 复制 CSS 文件
if (fs.existsSync('src/styles/main.css')) {
  fs.copySync('src/styles/main.css', 'public/assets/css/main.css');
}
  
import { initializeEditor, formatJSON, copyToClipboard, handleFileUpload, downloadFile } from './utils/editor.js';
import { showNotification } from './utils/notification.js';

// 初始化编辑器
const inputEditor = initializeEditor('json-input', {
    placeholder: 'Paste your JSON here'
});
const outputEditor = initializeEditor('json-output', {
    readOnly: true
});

// 设置示例 JSON
const exampleJSON = {
    "example": "Paste your JSON here"
};
inputEditor.setValue(JSON.stringify(exampleJSON, null, 4));

// 格式化按钮
document.getElementById('format').addEventListener('click', () => {
    const input = inputEditor.getValue();
    try {
        const formatted = formatJSON(input, {
            indent: parseInt(document.getElementById('indent').value),
            sortKeys: document.getElementById('sortKeys').checked
        });
        outputEditor.setValue(formatted);
        showNotification('JSON formatted successfully!', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
});

// 复制按钮
document.getElementById('copy').addEventListener('click', () => {
    const output = outputEditor.getValue();
    if (output) {
        copyToClipboard(output);
        showNotification('Copied to clipboard!', 'success');
    } else {
        showNotification('Nothing to copy!', 'error');
    }
});

// 粘贴按钮
document.getElementById('paste').addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        inputEditor.setValue(text);
        showNotification('Text pasted from clipboard!', 'success');
    } catch (error) {
        showNotification('Failed to read from clipboard!', 'error');
    }
});

// 展开按钮
document.getElementById('expand').addEventListener('click', () => {
    const input = inputEditor.getValue();
    try {
        const parsed = JSON.parse(input);
        const expanded = JSON.stringify(parsed, null, parseInt(document.getElementById('indent').value));
        inputEditor.setValue(expanded);
        showNotification('JSON expanded!', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
});

// 压缩按钮
document.getElementById('minify').addEventListener('click', () => {
    const input = inputEditor.getValue();
    try {
        const parsed = JSON.parse(input);
        const minified = JSON.stringify(parsed);
        inputEditor.setValue(minified);
        showNotification('JSON minified!', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
});

// 清除按钮
document.getElementById('clear').addEventListener('click', () => {
    inputEditor.setValue('');
    outputEditor.setValue('');
    showNotification('Editors cleared!', 'success');
});

// 上传按钮
document.getElementById('upload').addEventListener('click', () => {
    handleFileUpload().then(content => {
        outputEditor.setValue(content);
        showNotification('File uploaded successfully!', 'success');
    }).catch(error => {
        showNotification(error.message, 'error');
    });
});

// 下载按钮
document.getElementById('download').addEventListener('click', () => {
    const output = outputEditor.getValue();
    if (output) {
        downloadFile(output, 'formatted.json');
        showNotification('File downloaded!', 'success');
    } else {
        showNotification('Nothing to download!', 'error');
    }
});

// 缩进选择
document.getElementById('indent').addEventListener('change', (event) => {
    const output = outputEditor.getValue();
    if (output) {
        try {
            const parsed = JSON.parse(output);
            const formatted = JSON.stringify(parsed, null, parseInt(event.target.value));
            outputEditor.setValue(formatted);
        } catch (error) {
            showNotification(error.message, 'error');
        }
    }
});

// 行号显示
document.getElementById('lineNumbers').addEventListener('change', (event) => {
    inputEditor.setOption('lineNumbers', event.target.checked);
    outputEditor.setOption('lineNumbers', event.target.checked);
});

// 自动格式化输入
inputEditor.on('change', () => {
    const input = inputEditor.getValue();
    if (!input) {
        outputEditor.setValue('');
        return;
    }
    try {
        const formatted = formatJSON(input, {
            indent: parseInt(document.getElementById('indent').value),
            sortKeys: document.getElementById('sortKeys').checked
        });
        outputEditor.setValue(formatted);
    } catch (error) {
        // 如果输入的 JSON 无效，不显示错误通知
    }
}); 
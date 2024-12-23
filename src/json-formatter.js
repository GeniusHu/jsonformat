// JSON Formatter 相关功能
let inputEditor, outputEditor;

document.addEventListener('DOMContentLoaded', () => {
    // 初始化输入编辑器
    inputEditor = CodeMirror(document.getElementById('json-input'), {
        mode: { name: 'javascript', json: true },
        theme: 'default',
        lineNumbers: true,
        lineWrapping: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        indentUnit: 4,
        tabSize: 4,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-lint-markers", "CodeMirror-foldgutter"],
        lint: true,
        foldGutter: true,
        extraKeys: {
            "Ctrl-Q": function(cm) {
                cm.foldCode(cm.getCursor());
            }
        },
        foldOptions: {
            widget: '...'
        }
    });

    // 初始化输出编辑器
    outputEditor = CodeMirror(document.getElementById('json-output'), {
        mode: { name: 'javascript', json: true },
        theme: 'default',
        lineNumbers: true,
        lineWrapping: true,
        matchBrackets: true,
        readOnly: true,
        indentUnit: 4,
        tabSize: 4,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        extraKeys: {
            "Ctrl-Q": function(cm) {
                cm.foldCode(cm.getCursor());
            }
        },
        foldOptions: {
            widget: '...'
        }
    });

    // 设置默认内容
    inputEditor.setValue('{\n    "example": "Paste your JSON here"\n}');
    
    // 监听设置变化
    document.getElementById('indent-size').addEventListener('change', () => {
        formatJSON();
    });

    document.getElementById('sort-keys').addEventListener('change', () => {
        formatJSON();
    });

    document.getElementById('line-numbers').addEventListener('change', (e) => {
        const showLineNumbers = e.target.checked;
        inputEditor.setOption('lineNumbers', showLineNumbers);
        outputEditor.setOption('lineNumbers', showLineNumbers);
        formatJSON();
    });

    // 绑定按钮事件
    document.getElementById('format').addEventListener('click', formatJSON);
    document.getElementById('clear').addEventListener('click', clearJSON);
    document.getElementById('copy').addEventListener('click', copyJSON);
    document.getElementById('paste').addEventListener('click', pasteJSON);
    document.getElementById('expand').addEventListener('click', expandJSON);
    document.getElementById('minify').addEventListener('click', minifyJSON);
    document.getElementById('download').addEventListener('click', downloadJSON);
    document.getElementById('upload').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        input.onchange = handleFileUpload;
        input.click();
    });
});

// 格式化 JSON
function formatJSON() {
    try {
        const indentSize = document.getElementById('indent-size').value;
        const sortKeys = document.getElementById('sort-keys').checked;
        const input = inputEditor.getValue();
        let parsed = JSON.parse(input);
        
        if (sortKeys) {
            parsed = sortObjectKeys(parsed);
        }
        
        const formatted = JSON.stringify(parsed, null, indentSize === 'tab' ? '\t' : Number(indentSize));
        outputEditor.setValue(formatted);
        
        showToast('JSON formatted successfully', 'success');
    } catch (error) {
        showToast(`Invalid JSON: ${error.message}`, 'error');
    }
}

// 清空编辑器
function clearJSON() {
    inputEditor.setValue('');
    outputEditor.setValue('');
    showToast('Editor cleared', 'info');
}

// 复制格式化后的 JSON
async function copyJSON() {
    try {
        const output = outputEditor.getValue();
        await navigator.clipboard.writeText(output);
        showToast('JSON copied to clipboard', 'success');
    } catch (error) {
        showToast('Failed to copy JSON', 'error');
    }
}

// 从剪贴板粘贴
async function pasteJSON() {
    try {
        const text = await navigator.clipboard.readText();
        inputEditor.setValue(text);
        formatJSON();
        showToast('JSON pasted from clipboard', 'success');
    } catch (error) {
        showToast('Failed to paste JSON', 'error');
    }
}

// 展开所有节点
function expandJSON() {
    try {
        const input = inputEditor.getValue();
        const parsed = JSON.parse(input);
        const expanded = JSON.stringify(parsed, null, 4);
        outputEditor.setValue(expanded);
        outputEditor.execCommand('unfoldAll');
        showToast('JSON expanded', 'success');
    } catch (error) {
        showToast(`Invalid JSON: ${error.message}`, 'error');
    }
}

// 压缩 JSON
function minifyJSON() {
    try {
        const input = inputEditor.getValue();
        const parsed = JSON.parse(input);
        const minified = JSON.stringify(parsed, null, 0);
        outputEditor.setValue(minified);
        outputEditor.execCommand('foldAll');
        showToast('JSON minified', 'success');
    } catch (error) {
        showToast(`Invalid JSON: ${error.message}`, 'error');
    }
}

// 下载 JSON 文件
function downloadJSON() {
    try {
        const output = outputEditor.getValue();
        const blob = new Blob([output], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formatted.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('JSON downloaded', 'success');
    } catch (error) {
        showToast('Failed to download JSON', 'error');
    }
}

// 递归排序对象的键
function sortObjectKeys(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    
    if (Array.isArray(obj)) {
        return obj.map(sortObjectKeys);
    }
    
    return Object.keys(obj)
        .sort()
        .reduce((acc, key) => {
            acc[key] = sortObjectKeys(obj[key]);
            return acc;
        }, {});
}

// 显示提示消息
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = document.createElement('span');
    icon.className = 'toast-icon';
    icon.innerHTML = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    
    const text = document.createElement('p');
    text.className = 'toast-message';
    text.textContent = message;
    
    toast.appendChild(icon);
    toast.appendChild(text);
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toast-out-center 0.3s forwards';
        setTimeout(() => container.removeChild(toast), 300);
    }, 3000);
}

// 处理文件上传
async function handleFileUpload(event) {
    try {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.name.endsWith('.json') && file.type !== 'application/json') {
            showToast('Please select a JSON file', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                // 验证是否为有效的 JSON
                JSON.parse(content);
                inputEditor.setValue(content);
                formatJSON();
                showToast('File uploaded successfully', 'success');
            } catch (error) {
                showToast('Invalid JSON file', 'error');
            }
        };
        reader.onerror = () => {
            showToast('Error reading file', 'error');
        };
        reader.readAsText(file);
    } catch (error) {
        showToast('Failed to upload file', 'error');
    }
}
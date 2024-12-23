import { initializeCodeMirror, formatJSON, copyToClipboard, handleFileUpload } from './utils/editor.js';
import { showNotification } from './utils/notification.js';

// 初始化编辑器实例
let inputEditor, outputEditor, schemaEditor;

// DOM 元素
const validateBtn = document.getElementById('validate');
const clearBtn = document.getElementById('clear');
const formatBtn = document.getElementById('format');
const pasteBtn = document.getElementById('paste');
const uploadBtn = document.getElementById('upload');
const copyBtn = document.getElementById('copy');
const realTimeValidationCheckbox = document.getElementById('real-time-validation');
const lineNumbersCheckbox = document.getElementById('line-numbers');
const schemaValidationCheckbox = document.getElementById('schema-validation');
const schemaContainer = document.getElementById('schema-editor');
const statusIcon = document.getElementById('status-icon');
const statusText = document.getElementById('status-text');

// 初始化编辑器
document.addEventListener('DOMContentLoaded', () => {
    // 初始化输入编辑器
    inputEditor = initializeCodeMirror('json-input', {
        mode: 'application/json',
        lint: true,
        gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        lineNumbers: true,
        foldGutter: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        tabSize: 2,
        extraKeys: {
            'Ctrl-Space': 'autocomplete',
            'Ctrl-Q': function(cm) {
                cm.foldCode(cm.getCursor());
            }
        }
    });

    // 初始化输出编辑器
    outputEditor = initializeCodeMirror('validation-output', {
        mode: 'application/json',
        readOnly: true,
        lineNumbers: true,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        matchBrackets: true,
        tabSize: 2
    });

    // 初始化 Schema 编辑器
    schemaEditor = initializeCodeMirror('schema-input', {
        mode: 'application/json',
        lint: true,
        gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        lineNumbers: true,
        foldGutter: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        tabSize: 2
    });

    // 设置初始状态
    updateValidationStatus('pending', 'Waiting for input...');
    
    // 绑定事件监听器
    bindEventListeners();
});

// 绑定事件监听器
function bindEventListeners() {
    // 验证按钮
    validateBtn.addEventListener('click', validateJSON);

    // 清除按钮
    clearBtn.addEventListener('click', () => {
        inputEditor.setValue('');
        outputEditor.setValue('');
        updateValidationStatus('pending', 'Waiting for input...');
    });

    // 格式化按钮
    formatBtn.addEventListener('click', () => {
        try {
            const input = inputEditor.getValue();
            if (!input.trim()) {
                showNotification('Please enter JSON first', 'warning');
                return;
            }
            const formatted = formatJSON(input);
            inputEditor.setValue(formatted);
            validateJSON();
        } catch (err) {
            showNotification('Invalid JSON format', 'error');
        }
    });

    // 粘贴按钮
    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            inputEditor.setValue(text);
            validateJSON();
        } catch (err) {
            showNotification('Failed to read clipboard', 'error');
        }
    });

    // 上传按钮
    uploadBtn.addEventListener('click', () => {
        handleFileUpload((content) => {
            inputEditor.setValue(content);
            validateJSON();
        });
    });

    // 复制按钮
    copyBtn.addEventListener('click', () => {
        const content = inputEditor.getValue();
        if (!content.trim()) {
            showNotification('Nothing to copy', 'warning');
            return;
        }
        copyToClipboard(content);
        showNotification('Copied to clipboard', 'success');
    });

    // 实时验证复选框
    realTimeValidationCheckbox.addEventListener('change', () => {
        if (realTimeValidationCheckbox.checked) {
            validateJSON();
        }
    });

    // 行号复选框
    lineNumbersCheckbox.addEventListener('change', () => {
        const showLineNumbers = lineNumbersCheckbox.checked;
        inputEditor.setOption('lineNumbers', showLineNumbers);
        outputEditor.setOption('lineNumbers', showLineNumbers);
        schemaEditor.setOption('lineNumbers', showLineNumbers);
    });

    // Schema 验证复选框
    schemaValidationCheckbox.addEventListener('change', () => {
        schemaContainer.classList.toggle('hidden', !schemaValidationCheckbox.checked);
        if (schemaValidationCheckbox.checked) {
            validateJSON();
        }
    });

    // 输入编辑器变化事件
    inputEditor.on('change', () => {
        if (realTimeValidationCheckbox.checked) {
            validateJSON();
        }
    });

    // Schema 编辑器变化事件
    schemaEditor.on('change', () => {
        if (realTimeValidationCheckbox.checked && schemaValidationCheckbox.checked) {
            validateJSON();
        }
    });
}

// 验证 JSON
function validateJSON() {
    const input = inputEditor.getValue().trim();
    
    if (!input) {
        updateValidationStatus('pending', 'Waiting for input...');
        outputEditor.setValue('');
        return;
    }

    try {
        // 解析 JSON
        const parsedJSON = JSON.parse(input);
        
        // 如果启用了 Schema 验证
        if (schemaValidationCheckbox.checked) {
            const schemaInput = schemaEditor.getValue().trim();
            if (schemaInput) {
                try {
                    const schema = JSON.parse(schemaInput);
                    // 这里可以添加 Schema 验证逻辑
                    // 目前仅验证 Schema 格式是否正确
                    updateValidationStatus('valid', 'JSON is valid (Schema validation not implemented yet)');
                } catch (err) {
                    updateValidationStatus('invalid', 'Invalid JSON Schema format');
                    outputEditor.setValue(formatJSON({
                        error: 'Invalid JSON Schema format',
                        message: err.message
                    }));
                    return;
                }
            }
        }

        // 显示格式化的 JSON
        outputEditor.setValue(formatJSON(parsedJSON));
        updateValidationStatus('valid', 'JSON is valid');
    } catch (err) {
        updateValidationStatus('invalid', 'Invalid JSON format');
        outputEditor.setValue(formatJSON({
            error: 'Invalid JSON format',
            message: err.message,
            position: getErrorPosition(err.message)
        }));
    }
}

// 更新验证状态
function updateValidationStatus(status, message) {
    statusIcon.className = `status-icon status-${status}`;
    statusText.textContent = message;
}

// 从错误消息中提取位置信息
function getErrorPosition(errorMessage) {
    const positionMatch = errorMessage.match(/position (\d+)/);
    if (positionMatch) {
        return parseInt(positionMatch[1]);
    }
    return null;
}

// 导出编辑器实例供其他模块使用
export const editors = {
    input: inputEditor,
    output: outputEditor,
    schema: schemaEditor
}; 
// 初始化 CodeMirror 编辑器
export function initializeCodeMirror(elementId, options = {}) {
    return CodeMirror(document.getElementById(elementId), {
        theme: 'default',
        ...options
    });
}

// 格式化 JSON
export function formatJSON(json) {
    if (typeof json === 'string') {
        json = JSON.parse(json);
    }
    return JSON.stringify(json, null, 2);
}

// 复制到剪贴板
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
}

// 处理文件上传
export function handleFileUpload(callback) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.txt';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            callback(event.target.result);
        };
        reader.readAsText(file);
    };
    
    input.click();
} 
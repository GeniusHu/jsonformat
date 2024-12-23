// XML 工具相关功能
import CodeMirror from '../node_modules/codemirror/lib/codemirror.js';

// 初始化编辑器
let xmlEditor, jsonEditor;

document.addEventListener('DOMContentLoaded', () => {
    // 初始化 XML 编辑器
    xmlEditor = CodeMirror(document.getElementById('xml-input'), {
        mode: 'xml',
        theme: 'default',
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        lineWrapping: true
    });

    // 初始化 JSON 编辑器
    jsonEditor = CodeMirror(document.getElementById('json-output'), {
        mode: { name: 'javascript', json: true },
        theme: 'default',
        lineNumbers: true,
        matchBrackets: true,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        readOnly: true,
        lineWrapping: true
    });

    // 绑定转换按钮事件
    document.getElementById('convert').addEventListener('click', convertXmlToJson);
});

// XML 到 JSON 的转换函数
function convertXmlToJson() {
    try {
        const xmlContent = xmlEditor.getValue().trim();
        if (!xmlContent) {
            alert('Please enter XML data');
            return;
        }

        // TODO: 实现 XML 到 JSON 的转换逻辑
        const jsonResult = '{"message": "XML to JSON conversion not implemented yet"}';
        jsonEditor.setValue(JSON.stringify(JSON.parse(jsonResult), null, 2));
    } catch (error) {
        alert('Error converting XML: ' + error.message);
    }
}

export { convertXmlToJson }; 
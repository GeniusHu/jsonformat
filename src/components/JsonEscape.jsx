import { useState } from 'react'
import '../styles/JsonEditor.css'

export default function JsonEscape({ onStatusChange, input, onInputChange }) {
  const [output, setOutput] = useState('')

  const handleEscape = () => {
    if (!input.trim()) {
      return
    }
    try {
      // 如果输入已经是转义的 JSON，先尝试解析
      if (input.includes('\\')) {
        try {
          const unescaped = JSON.parse(`"${input.replace(/^"|"$/g, '')}"`)
          setOutput(JSON.stringify(unescaped).slice(1, -1))
          onStatusChange('Text escaped successfully!', 'success')
          return
        } catch (e) {
          // 如果解析失败，继续正常转义流程
          console.log('Not a valid escaped string, proceeding with normal escape')
        }
      }
      
      const escaped = JSON.stringify(input)
      const formattedOutput = escaped
        .slice(1, -1)
        .replace(/\\n/g, '\n')  // 保持原有的换行
        .replace(/\\r/g, '')    // 移除回车符
      setOutput(formattedOutput)
      onStatusChange('Text escaped successfully!', 'success')
    } catch (error) {
      onStatusChange('Failed to escape text', 'error')
    }
  }

  const handleUnescape = () => {
    if (!input.trim()) {
      return
    }
    try {
      // 处理可能多次转义的情况
      let result = input
      let previousResult = ''
      
      // 持续尝试解析，���到无法继续解析
      while (result !== previousResult) {
        previousResult = result
        try {
          result = JSON.parse(`"${result}"`)
        } catch (e) {
          break
        }
      }
      
      setOutput(result)
      onStatusChange('Text unescaped successfully!', 'success')
    } catch (error) {
      onStatusChange('Failed to unescape text', 'error')
    }
  }

  const copyOutput = async () => {
    if (!output.trim()) {
      return
    }
    try {
      await navigator.clipboard.writeText(output)
      onStatusChange('Copied to clipboard!', 'success')
    } catch (err) {
      onStatusChange('Failed to copy', 'error')
    }
  }

  const handleInputKeyDown = (e) => {
    if (e.key === 'a' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      e.target.select()
    }
  }

  const handleOutputKeyDown = (e) => {
    if (e.key === 'a' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      const range = document.createRange()
      range.selectNodeContents(e.target)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  const getLineNumbers = () => {
    return Array.from({ length: 37 }, (_, i) => i + 1)
  }

  const handleInputChange = (e) => {
    onInputChange(e.target.value)
  }

  return (
    <div className="container">
      <div className="json-editor">
        <div className="input-section">
          <div className="section-header">
            <h2>Input Text</h2>
            <div className="actions">
              <button 
                className="action-btn" 
                onClick={handleEscape}
                disabled={!input.trim()}
              >
                Escape
              </button>
              <button 
                className="action-btn" 
                onClick={handleUnescape}
                disabled={!input.trim()}
              >
                Unescape
              </button>
            </div>
          </div>
          <div className="editor-content">
            <div className="line-numbers">
              {getLineNumbers().map(num => (
                <span key={num}>{num}</span>
              ))}
            </div>
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Paste your text here..."
              spellCheck="false"
              onKeyDown={handleInputKeyDown}
              onScroll={(e) => {
                const lineNumbers = e.target.previousSibling
                if (lineNumbers) {
                  lineNumbers.scrollTop = e.target.scrollTop
                }
              }}
            />
          </div>
        </div>

        <div className="output-section">
          <div className="section-header">
            <h2>Output</h2>
            <div className="actions">
              <button 
                className="action-btn" 
                onClick={copyOutput}
                disabled={!output.trim()}
              >
                Copy
              </button>
            </div>
          </div>
          <div className="editor-content">
            <div className="line-numbers">
              {getLineNumbers().map(num => (
                <span key={num}>{num}</span>
              ))}
            </div>
            <pre 
              className="output-area"
              style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
              onKeyDown={handleOutputKeyDown}
              tabIndex="0"
              onScroll={(e) => {
                const lineNumbers = e.target.previousSibling
                if (lineNumbers) {
                  lineNumbers.scrollTop = e.target.scrollTop
                }
              }}
            >
              {output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
} 
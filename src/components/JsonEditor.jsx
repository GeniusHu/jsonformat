import { useState, useRef } from 'react'
import '../styles/JsonEditor.css'
import { formatJson as formatJsonWithColor } from '../utils/jsonFormatter'

export default function JsonEditor({ onStatusChange, input, onInputChange }) {
  const [output, setOutput] = useState('')
  const [error, setError] = useState(null)
  const [isExpanded, setIsExpanded] = useState(true)
  const textareaRef = useRef(null)

  const handleFormat = () => {
    try {
      let jsonToFormat = input

      // 如果输入包含转义字符，尝试解析转义的 JSON
      if (input.includes('\\')) {
        try {
          // 先尝试作为转义字符串解析
          const unescaped = JSON.parse(`"${input.replace(/^"|"$/g, '')}"`)
          // 再尝试作为 JSON 对象解析
          jsonToFormat = JSON.parse(unescaped)
        } catch (e1) {
          try {
            // 如果上面失败，直接尝试解析转义的 JSON
            jsonToFormat = JSON.parse(input.replace(/\\"/g, '"').replace(/\\\\/g, '\\'))
          } catch (e2) {
            // 如果都失败了，使用原始输入继续尝试
            console.log('Not a valid escaped JSON, using original input')
          }
        }
      } else {
        // 如果不包含转义字符，直接解析
        jsonToFormat = JSON.parse(input)
      }

      const formatted = formatJsonWithColor(jsonToFormat, isExpanded)
      setOutput(formatted)
      setError(null)
      onStatusChange('JSON formatted successfully!', 'success')
    } catch (error) {
      const errorMessage = error.message
      const match = errorMessage.match(/position (\d+)/)
      if (match) {
        const position = parseInt(match[1])
        if (textareaRef.current) {
          textareaRef.current.focus()
          textareaRef.current.setSelectionRange(position - 1, position + 2)
        }
        setError({ message: errorMessage, position })
        onStatusChange('Invalid JSON format', 'error')
      }
    }
  }

  const copyOutput = async () => {
    try {
      const temp = document.createElement('div')
      temp.innerHTML = output
      const plainText = temp.textContent || temp.innerText
      
      await navigator.clipboard.writeText(plainText)
      onStatusChange('Copied to clipboard!', 'success')
    } catch (err) {
      onStatusChange('Failed to copy', 'error')
    }
  }

  const clearInput = () => {
    onInputChange('')
    setOutput('')
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      onInputChange(text)
      
      // 尝试解析并格式化粘贴的内容
      try {
        let jsonToFormat = text

        // 如果输入包含转义字符，尝试解析转义的 JSON
        if (text.includes('\\')) {
          try {
            const unescaped = JSON.parse(`"${text.replace(/^"|"$/g, '')}"`)
            jsonToFormat = JSON.parse(unescaped)
          } catch (e1) {
            try {
              jsonToFormat = JSON.parse(text.replace(/\\"/g, '"').replace(/\\\\/g, '\\'))
            } catch (e2) {
              console.log('Not a valid escaped JSON, using original input')
            }
          }
        } else {
          jsonToFormat = JSON.parse(text)
        }

        const formatted = formatJsonWithColor(jsonToFormat, isExpanded)
        setOutput(formatted)
        setError(null)
        onStatusChange('JSON formatted successfully!', 'success')
      } catch (error) {
        // 如果解析失败，只显示粘贴成功的消息
        onStatusChange('Pasted from clipboard!', 'success')
      }
    } catch (err) {
      onStatusChange('Failed to paste', 'error')
    }
  }

  const handleCompress = () => {
    setIsExpanded(false)
    try {
      const parsed = JSON.parse(input)
      const formatted = formatJsonWithColor(parsed, false)
      setOutput(formatted)
    } catch (error) {
      onStatusChange('Invalid JSON format', 'error')
    }
  }

  const handleExpand = () => {
    setIsExpanded(true)
    try {
      const parsed = JSON.parse(input)
      const formatted = formatJsonWithColor(parsed, true)
      setOutput(formatted)
    } catch (error) {
      onStatusChange('Invalid JSON format', 'error')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleFormat()
    }
  }

  const handleInput = (e) => {
    onInputChange(e.target.value)
    if (error) {
      setError(null)
    }
  }

  const handleFocus = () => {
    if (error) {
      setError(null)
    }
  }

  const getLineNumbers = () => {
    return Array.from({ length: 37 }, (_, i) => i + 1)
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

  return (
    <div className="container">
      <div className="json-editor">
        <div className="input-section">
          <div className="section-header">
            <h2>Input JSON</h2>
            <div className="actions">
              <button className="action-btn" onClick={clearInput}>
                Clear
              </button>
              <button className="action-btn" onClick={handlePaste}>
                Paste
              </button>
              <button className="format-btn" onClick={handleFormat}>
                Format <span className="keyboard-shortcut">⌘ ⏎</span>
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
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              onScroll={(e) => {
                const lineNumbers = e.target.previousSibling
                if (lineNumbers) {
                  lineNumbers.scrollTop = e.target.scrollTop
                }
              }}
              placeholder="Paste or type your JSON here..."
              spellCheck="false"
              className={error ? 'has-error' : ''}
            />
          </div>
        </div>

        <div className="output-section">
          <div className="section-header">
            <h2>Output</h2>
            <div className="actions">
              <button className="action-btn" onClick={handleCompress}>
                Compress
              </button>
              <button className="action-btn" onClick={handleExpand}>
                Expand
              </button>
              <button className="action-btn" onClick={copyOutput}>
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
              dangerouslySetInnerHTML={{ __html: output }}
              onScroll={(e) => {
                const lineNumbers = e.target.previousSibling
                if (lineNumbers) {
                  lineNumbers.scrollTop = e.target.scrollTop
                }
              }}
              tabIndex="0"
              onKeyDown={handleOutputKeyDown}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
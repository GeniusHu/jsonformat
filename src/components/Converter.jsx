import { useState } from 'react'
import '../styles/Converter.css'
import { formatJson } from '../utils/jsonFormatter'
import { 
  convertToJava, 
  convertToKotlin,
  convertToXml,
  convertToYaml,
  convertToToml 
} from '../utils/converters'

export default function Converter({ onStatusChange }) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [selectedLang, setSelectedLang] = useState('java')
  const [className, setClassName] = useState('MyClass')

  const languages = [
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'kotlin', name: 'Kotlin', icon: '🎯' },
    { id: 'xml', name: 'XML', icon: '📝' },
    { id: 'yaml', name: 'YAML', icon: '📋' },
    { id: 'toml', name: 'TOML', icon: '⚙️' }
  ]

  const handleConvert = () => {
    try {
      const parsed = JSON.parse(input)
      let converted = ''

      switch (selectedLang) {
        case 'java':
          converted = convertToJava(parsed, className)
          break
        case 'kotlin':
          converted = convertToKotlin(parsed, className)
          break
        case 'xml':
          converted = convertToXml(parsed)
          break
        case 'yaml':
          converted = convertToYaml(parsed)
          break
        case 'toml':
          converted = convertToToml(parsed)
          break
      }

      setOutput(converted)
      onStatusChange('Conversion successful!', 'success')
    } catch (error) {
      onStatusChange('Invalid JSON input', 'error')
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

  return (
    <div className="container">
      <div className="json-editor">
        <div className="input-section">
          <div className="section-header">
            <h2>Input JSON</h2>
            <div className="actions">
              <div className="language-selector">
                {languages.map(lang => (
                  <button
                    key={lang.id}
                    className={`lang-btn ${selectedLang === lang.id ? 'active' : ''}`}
                    onClick={() => setSelectedLang(lang.id)}
                  >
                    <span className="lang-icon">{lang.icon}</span>
                    {lang.name}
                  </button>
                ))}
              </div>
              <div className="action-buttons">
                {(selectedLang === 'java' || selectedLang === 'kotlin') && (
                  <div className="class-name-input">
                    <input
                      type="text"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      placeholder="Class Name..."
                    />
                  </div>
                )}
                <button className="format-btn" onClick={handleConvert}>
                  Convert
                </button>
              </div>
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
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JSON here..."
              spellCheck="false"
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
            <h2>Output {languages.find(l => l.id === selectedLang)?.name}</h2>
            <div className="actions">
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
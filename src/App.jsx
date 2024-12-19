import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import JsonEditor from './components/JsonEditor'
import Converter from './components/Converter'
import JsonEscape from './components/JsonEscape'
import Toast from './components/Toast'
import { ThemeProvider } from './contexts/ThemeContext'
import './styles/App.css'

export default function App() {
  const [toast, setToast] = useState({ show: false, message: '', type: '' })
  const [jsonInput, setJsonInput] = useState('')
  const [converterInput, setConverterInput] = useState('')
  const [escapeInput, setEscapeInput] = useState('')

  const showToast = (message, type) => {
    setToast({ show: true, message, type })
  }

  const hideToast = () => {
    setToast({ show: false, message: '', type: '' })
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route 
              path="/" 
              element={
                <JsonEditor 
                  onStatusChange={showToast} 
                  input={jsonInput}
                  onInputChange={setJsonInput}
                />
              } 
            />
            <Route 
              path="/converter" 
              element={
                <Converter 
                  onStatusChange={showToast}
                  input={converterInput}
                  onInputChange={setConverterInput}
                />
              } 
            />
            <Route 
              path="/escape" 
              element={
                <JsonEscape 
                  onStatusChange={showToast}
                  input={escapeInput}
                  onInputChange={setEscapeInput}
                />
              } 
            />
          </Routes>
        </Layout>
        <Toast 
          message={toast.message} 
          type={toast.type} 
          show={toast.show}
          onClose={hideToast}
        />
      </BrowserRouter>
    </ThemeProvider>
  )
}
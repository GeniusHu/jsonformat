import '../styles/ToolsGrid.css'
import validator from '../imgs/validator.png'
import convert from '../imgs/convert.png'
import minify from '../imgs/minify.png'

export default function ToolsGrid() {
  const tools = [
    {
      icon: validator,
      title: 'JSON Validator',
      description: 'Validate and verify your JSON structure with detailed error reporting'
    },
    {
      icon: convert,
      title: 'JSON to CSV',
      description: 'Convert JSON data to CSV format with customizable options'
    },
    {
      icon: minify,
      title: 'JSON Minifier',
      description: 'Minify JSON data by removing whitespace and comments'
    }
  ]

  return (
    <div className="container">
      <div className="tools-grid">
        {tools.map((tool, index) => (
          <div key={index} className="tool-card">
            <img src={tool.icon} alt={tool.title} className="tool-icon" />
            <h3>{tool.title}</h3>
            <p>{tool.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
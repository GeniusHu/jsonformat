import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'  // 使用暗色主题
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-kotlin'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-toml'

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function getJavaType(value, key, isArrayItem = false) {
  if (value === null) return 'Object'
  if (Array.isArray(value)) {
    if (value.length === 0) return 'List<Object>'
    const singularKey = key.replace(/s$/, '')
    return `List<${getJavaType(value[0], singularKey, true)}>`
  }
  
  switch (typeof value) {
    case 'string': return 'String'
    case 'number': return Number.isInteger(value) ? 'Integer' : 'Double'
    case 'boolean': return 'Boolean'
    case 'object': 
      return isArrayItem ? capitalizeFirstLetter(key) : capitalizeFirstLetter(key)
    default: return 'Object'
  }
}

function generateJavaClass(json, className, processedClasses = new Set()) {
  if (processedClasses.has(className)) return ''
  processedClasses.add(className)
  
  let result = ''
  let innerClasses = new Set()
  
  Object.entries(json).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      const singularKey = capitalizeFirstLetter(key.replace(/s$/, ''))
      innerClasses.add(generateJavaClass(value[0], singularKey, processedClasses))
    }
  })
  
  Object.entries(json).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const innerClassName = capitalizeFirstLetter(key)
      innerClasses.add(generateJavaClass(value, innerClassName, processedClasses))
    }
  })
  
  result += `public class ${className} {\n`
  
  Object.entries(json).forEach(([key, value]) => {
    const type = getJavaType(value, key)
    result += `    private ${type} ${key};\n`
  })
  result += '\n'
  
  result += `    public ${className}() {}\n\n`
  
  Object.entries(json).forEach(([key, value], index, array) => {
    const type = getJavaType(value, key)
    const capitalizedKey = capitalizeFirstLetter(key)
    
    result += `    public ${type} get${capitalizedKey}() {\n`
    result += `        return ${key};\n`
    result += `    }\n\n`
    
    result += `    public void set${capitalizedKey}(${type} ${key}) {\n`
    result += `        this.${key} = ${key};\n`
    result += `    }`
    
    if (index < array.length - 1) {
      result += '\n\n'
    }
  })
  
  result += '\n}'
  
  const allInnerClasses = Array.from(innerClasses).filter(Boolean).join('\n\n')
  
  return allInnerClasses ? `${result}\n\n${allInnerClasses}` : result
}

export function convertToJava(json, className) {
  try {
    const code = `import java.util.List;\n\n${generateJavaClass(json, className)}`
    return Prism.highlight(code, Prism.languages.java, 'java')
  } catch (error) {
    console.error('Error converting to Java:', error)
    return '// Error converting to Java class'
  }
}

function getKotlinType(value, key, isArrayItem = false) {
  if (value === null) return 'Any?'
  if (Array.isArray(value)) {
    if (value.length === 0) return 'List<Any>'
    const singularKey = key.replace(/s$/, '')
    return `List<${getKotlinType(value[0], singularKey, true)}>`
  }
  
  switch (typeof value) {
    case 'string': return 'String'
    case 'number': return Number.isInteger(value) ? 'Int' : 'Double'
    case 'boolean': return 'Boolean'
    case 'object': 
      return isArrayItem ? capitalizeFirstLetter(key) : capitalizeFirstLetter(key)
    default: return 'Any'
  }
}

function generateKotlinClass(json, className, processedClasses = new Set()) {
  if (processedClasses.has(className)) return ''
  processedClasses.add(className)
  
  let result = ''
  let innerClasses = new Set()
  
  Object.entries(json).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      const singularKey = capitalizeFirstLetter(key.replace(/s$/, ''))
      innerClasses.add(generateKotlinClass(value[0], singularKey, processedClasses))
    }
  })
  
  Object.entries(json).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const innerClassName = capitalizeFirstLetter(key)
      innerClasses.add(generateKotlinClass(value, innerClassName, processedClasses))
    }
  })
  
  result += `data class ${className}(\n`
  
  const properties = Object.entries(json).map(([key, value]) => {
    const type = getKotlinType(value, key)
    const nullableMark = value === null ? '?' : ''
    return `    val ${key}: ${type}${nullableMark}`
  })
  
  result += properties.join(',\n')
  result += '\n)'
  
  const allInnerClasses = Array.from(innerClasses).filter(Boolean).join('\n\n')
  
  return allInnerClasses ? `${result}\n\n${allInnerClasses}` : result
}

export function convertToKotlin(json, className) {
  try {
    const code = generateKotlinClass(json, className)
    return Prism.highlight(code, Prism.languages.kotlin, 'kotlin')
  } catch (error) {
    console.error('Error converting to Kotlin:', error)
    return '// Error converting to Kotlin class'
  }
}

export function convertToXml(json) {
  function toXml(obj, rootName = 'root') {
    if (obj === null) return `<${rootName}/>`
    
    if (typeof obj !== 'object') {
      return `<${rootName}>${obj}</${rootName}>`
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => toXml(item, 'item')).join('\n')
    }
    
    const children = Object.entries(obj).map(([key, value]) => {
      return '  ' + toXml(value, key)
    }).join('\n')
    
    return `<${rootName}>\n${children}\n</${rootName}>`
  }
  
  try {
    const code = `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(json)}`
    return Prism.highlight(code, Prism.languages.markup, 'xml')
  } catch (error) {
    console.error('Error converting to XML:', error)
    return '<!-- Error converting to XML -->'
  }
}

export function convertToYaml(json) {
  function toYaml(obj, indent = 0) {
    if (obj === null) return 'null'
    
    const spaces = ' '.repeat(indent)
    
    if (typeof obj !== 'object') {
      if (typeof obj === 'string') {
        if (obj.includes('\n') || obj.includes('"')) {
          return `|\n${spaces}  ${obj.replace(/\n/g, `\n${spaces}  `)}`
        }
        return obj.includes(' ') ? `"${obj}"` : obj
      }
      return String(obj)
    }
    
    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]'
      return obj.map(item => `${spaces}- ${toYaml(item, indent + 2)}`).join('\n')
    }
    
    if (Object.keys(obj).length === 0) return '{}'
    
    return Object.entries(obj).map(([key, value]) => {
      const valueStr = toYaml(value, indent + 2)
      return `${spaces}${key}: ${valueStr.includes('\n') ? '\n' + ' '.repeat(indent + 2) + valueStr.trimLeft() : valueStr}`
    }).join('\n')
  }
  
  try {
    const code = toYaml(json)
    return Prism.highlight(code, Prism.languages.yaml, 'yaml')
  } catch (error) {
    console.error('Error converting to YAML:', error)
    return '# Error converting to YAML'
  }
}

export function convertToToml(json) {
  function toToml(obj, path = '') {
    let result = ''
    
    // 处理数组
    if (Array.isArray(obj)) {
      return obj.map((item, index) => {
        if (typeof item === 'object' && item !== null) {
          const arrayPath = path ? `${path}.${index}` : `${index}`
          return toToml(item, arrayPath)
        } else {
          return JSON.stringify(item)
        }
      }).join('\n')
    }
    
    // 处理对象
    if (typeof obj === 'object' && obj !== null) {
      // 添加表头
      if (path) {
        result += `[[${path}]]\n`
      }
      
      // 处理基本类型属性
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value !== 'object' || value === null) {
          if (typeof value === 'string') {
            result += `${key} = "${value}"\n`
          } else if (Array.isArray(value)) {
            result += `${key} = ${JSON.stringify(value)}\n`
          } else {
            result += `${key} = ${value}\n`
          }
        }
      }
      
      // 处理嵌套对象
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          const newPath = path ? `${path}.${key}` : key
          result += '\n' + toToml(value, newPath)
        }
      }
      
      // 处理数组对象
      for (const [key, value] of Object.entries(obj)) {
        if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
          const newPath = path ? `${path}.${key}` : key
          result += '\n' + value.map(item => toToml(item, newPath)).join('\n')
        }
      }
    }
    
    return result
  }
  
  try {
    const code = toToml(json).trim()
    return Prism.highlight(code, Prism.languages.toml, 'toml')
  } catch (error) {
    console.error('Error converting to TOML:', error)
    return '# Error converting to TOML'
  }
} 
export function formatJson(obj, expanded = true) {
  let level = 0;

  function processValue(value, isLast = false) {
    const indent = expanded ? '  '.repeat(level) : '';
    const newline = expanded ? '\n' : '';
    const comma = isLast ? '' : ',';

    if (value === null) return `null${comma}`;
    if (typeof value === 'boolean') return `<span class="json-boolean">${value}</span>${comma}`;
    if (typeof value === 'number') return `<span class="json-number">${value}</span>${comma}`;
    if (typeof value === 'string') return `<span class="json-string">"${value}"</span>${comma}`;
    
    if (Array.isArray(value)) {
      if (value.length === 0) return `[]${comma}`;
      
      level++;
      const items = value.map((item, i) => 
        `${indent}${expanded ? '  ' : ''}${processValue(item, i === value.length - 1)}`
      ).join(newline);
      level--;
      
      return `[${newline}${items}${newline}${indent}]${comma}`;
    }
    
    if (typeof value === 'object') {
      const entries = Object.entries(value);
      if (entries.length === 0) return `{}${comma}`;
      
      level++;
      const items = entries.map(([key, val], i) => 
        `${indent}${expanded ? '  ' : ''}<span class="json-key">"${key}"</span>:${expanded ? ' ' : ''}${processValue(val, i === entries.length - 1)}`
      ).join(newline);
      level--;
      
      return `{${newline}${items}${newline}${indent}}${comma}`;
    }
    
    return String(value) + comma;
  }

  return processValue(obj, true);
} 
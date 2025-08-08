export class Link {
  constructor(id = null, values = null) {
    this.id = id;
    this.values = values || [];
  }

  toString() {
    return this.format(false);
  }

  getValuesString() {
    return (!this.values || this.values.length === 0) ? 
      '' : this.values.map(v => Link.getValueString(v)).join(' ');
  }

  simplify() {
    if (!this.values || this.values.length === 0) {
      return this;
    } else if (this.values.length === 1) {
      return this.values[0];
    } else {
      const newValues = this.values.map(v => v.simplify());
      return new Link(this.id, newValues);
    }
  }

  combine(other) {
    return new Link(null, [this, other]);
  }

  static getValueString(value) {
    return value.toLinkOrIdString();
  }

  static escapeReference(reference) {
    if (!reference || reference.trim() === '') {
      return '';
    }
    
    const needsSingleQuotes = 
      reference.includes(':') ||
      reference.includes('(') ||
      reference.includes(')') ||
      reference.includes(' ') ||
      reference.includes('\t') ||
      reference.includes('\n') ||
      reference.includes('\r') ||
      reference.includes('"');
    
    if (needsSingleQuotes) {
      return `'${reference}'`;
    } else if (reference.includes("'")) {
      return `"${reference}"`;
    } else {
      return reference;
    }
  }

  toLinkOrIdString() {
    if (!this.values || this.values.length === 0) {
      return this.id === null ? '' : Link.escapeReference(this.id);
    }
    return this.toString();
  }

  equals(other) {
    if (!(other instanceof Link)) return false;
    if (this.id !== other.id) return false;
    if (this.values.length !== other.values.length) return false;
    
    for (let i = 0; i < this.values.length; i++) {
      if (!this.values[i].equals(other.values[i])) {
        return false;
      }
    }
    return true;
  }

  
  format(lessParentheses = false) {
    // Empty link
    if (this.id === null && (!this.values || this.values.length === 0)) {
      return lessParentheses ? '' : '()';
    }
    
    // Link with only ID, no values
    if (!this.values || this.values.length === 0) {
      const escapedId = Link.escapeReference(this.id);
      return lessParentheses && !this.needsParentheses(this.id) ? escapedId : `(${escapedId})`;
    }
    
    // Format values recursively  
    const valuesStr = this.values.map(v => this.formatValue(v)).join(' ');
    
    // Link with values only
    if (this.id === null) {
      return lessParentheses ? valuesStr : `(${valuesStr})`;
    }
    
    // Link with ID and values
    const idStr = Link.escapeReference(this.id);
    const withColon = `${idStr}: ${valuesStr}`;
    return lessParentheses && !this.needsParentheses(this.id) ? withColon : `(${withColon})`;
  }
  
  formatValue(value) {
    if (!value.format) {
      return Link.escapeReference(value.id || '');
    }
    
    // Simple value (just ID)
    if (!value.values || value.values.length === 0) {
      return Link.escapeReference(value.id);
    }
    
    // Nested structure - always use parentheses for nested values to preserve structure
    return value.format(false);
  }
  
  needsParentheses(str) {
    return str && (str.includes(' ') || str.includes(':') || str.includes('(') || str.includes(')'));
  }
}

export function formatLinks(links, lessParentheses = false) {
  if (!links || links.length === 0) return '';
  return links.map(link => link.format(lessParentheses)).join('\n');
}
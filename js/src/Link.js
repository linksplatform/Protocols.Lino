export class Link {
  constructor(id = null, values = null) {
    this.id = id;
    this.values = values || [];
  }

  toString() {
    if (this.id === null) {
      return `(${this.getValuesString()})`;
    } else if (!this.values || this.values.length === 0) {
      return `(${Link.escapeReference(this.id)})`;
    } else {
      return `(${Link.escapeReference(this.id)}: ${this.getValuesString()})`;
    }
  }

  getValuesString() {
    if (!this.values || this.values.length === 0) {
      return '';
    }
    return this.values.map(v => Link.getValueString(v)).join(' ');
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

  static fromValue(value) {
    if (value instanceof Link) {
      return value;
    }
    return new Link(value);
  }

  static fromTuple(source, target) {
    return new Link(null, [source, target]);
  }

  static fromTriple(id, source, target) {
    return new Link(id, [source, target]);
  }
  
  format(lessParentheses = false) {
    if (!this.values || this.values.length === 0) {
      if (this.id === null) {
        return lessParentheses ? '' : '()';
      }
      return lessParentheses && !this.needsParentheses(this.id)
        ? Link.escapeReference(this.id)
        : `(${Link.escapeReference(this.id)})`;
    }
    
    // Format values
    const formattedValues = this.values.map(v => {
      if (v.format) {
        // For nested links with values, format them with colon
        if (v.values && v.values.length > 0 && v.id) {
          return `(${Link.escapeReference(v.id)}: ${v.values.map(vv => vv.format ? vv.format(true) : Link.escapeReference(vv.id || '')).join(' ')})`;
        }
        // For simple values, just escape them
        if (v.id !== null && (!v.values || v.values.length === 0)) {
          return Link.escapeReference(v.id);
        }
        return v.format(true);
      }
      return Link.escapeReference(v.id || '');
    });
    
    const valuesStr = formattedValues.join(' ');
    
    if (this.id === null) {
      return lessParentheses ? valuesStr : `(${valuesStr})`;
    }
    
    const idStr = Link.escapeReference(this.id);
    if (lessParentheses && !this.needsParentheses(this.id)) {
      return `${idStr}: ${valuesStr}`;
    }
    return `(${idStr}: ${valuesStr})`;
  }
  
  needsParentheses(str) {
    return str && (str.includes(' ') || str.includes(':') || str.includes('(') || str.includes(')'));
  }
}

export function formatLinks(links, lessParentheses = false) {
  if (!links || links.length === 0) return '';
  return links.map(link => link.format(lessParentheses)).join('\n');
}
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

  
  format(lessParentheses = false, isCompoundValue = false) {
    // Empty link
    if (this.id === null && (!this.values || this.values.length === 0)) {
      return lessParentheses ? '' : '()';
    }
    
    // Link with only ID, no values
    if (!this.values || this.values.length === 0) {
      const escapedId = Link.escapeReference(this.id);
      // When used as a value in a compound link (created from combining links), wrap in parentheses
      if (isCompoundValue) {
        return `(${escapedId})`;
      }
      return lessParentheses && !this.needsParentheses(this.id) ? escapedId : `(${escapedId})`;
    }
    
    // Format values recursively  
    const valuesStr = this.values.map(v => this.formatValue(v)).join(' ');
    
    // Link with values only (null id)
    if (this.id === null) {
      // For lessParentheses mode with simple values, don't wrap the whole thing
      if (lessParentheses) {
        // Check if all values are simple (no nested values)
        const allSimple = this.values.every(v => !v.values || v.values.length === 0);
        if (allSimple) {
          // Format each value without extra wrapping
          const simpleValuesStr = this.values.map(v => Link.escapeReference(v.id)).join(' ');
          return simpleValuesStr;
        }
        // For mixed or complex values in lessParentheses mode, still avoid outer wrapper
        // but keep the inner formatting
        return valuesStr;
      }
      // For normal mode, wrap in parentheses
      return `(${valuesStr})`;
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
    
    // Check if we're in a compound link that was created from path combinations
    // This is indicated by having a parent context passed through
    const isCompoundFromPaths = this._isFromPathCombination === true;
    
    // For compound links from paths, format values with parentheses
    if (isCompoundFromPaths) {
      return value.format(false, true);
    }
    
    // Simple link with just an ID - don't wrap in parentheses when used as a value
    if (!value.values || value.values.length === 0) {
      return Link.escapeReference(value.id);
    }
    
    // Complex value with its own structure - format it normally with parentheses
    return value.format(false, false);
  }
  
  needsParentheses(str) {
    return str && (str.includes(' ') || str.includes(':') || str.includes('(') || str.includes(')'));
  }
}

export function formatLinks(links, lessParentheses = false) {
  if (!links || links.length === 0) return '';
  return links.map(link => link.format(lessParentheses)).join('\n');
}
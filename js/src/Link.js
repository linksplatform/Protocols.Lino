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
}
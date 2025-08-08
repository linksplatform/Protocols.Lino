export class LinksGroup {
  constructor(element, children = []) {
    this.element = element;
    this.children = children || [];
  }

  toList() {
    const result = [];
    this.collectLinks(result);
    return result;
  }

  collectLinks(result) {
    if (this.element) {
      result.push(this.element);
    }
    
    for (const child of this.children) {
      if (child instanceof LinksGroup) {
        child.collectLinks(result);
      } else if (child) {
        result.push(child);
      }
    }
  }

  toString() {
    let str = this.element ? this.element.toString() : '';
    if (this.children && this.children.length > 0) {
      const childrenStr = this.children.map(c => c.toString()).join('\n');
      str += '\n' + childrenStr;
    }
    return str;
  }
}
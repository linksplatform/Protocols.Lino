import { Link } from './Link.js';

export class Parser {
  constructor() {
    this.parserModule = null;
  }

  async initialize() {
    if (!this.parserModule) {
      try {
        this.parserModule = await import('./parser-generated.js');
      } catch (error) {
        throw new Error('Parser grammar not compiled. Run: bun run build:grammar');
      }
    }
  }

  parse(input) {
    if (!this.parserModule) {
      throw new Error('Parser not initialized. Call initialize() first.');
    }
    
    try {
      const rawResult = this.parserModule.parse(input);
      return this.transformResult(rawResult);
    } catch (error) {
      throw new Error(`Parse error: ${error.message}`);
    }
  }

  transformResult(rawResult) {
    const links = [];
    if (Array.isArray(rawResult)) {
      for (const item of rawResult) {
        this.collectLinks(item, [], links);
      }
    } else if (rawResult) {
      this.collectLinks(rawResult, [], links);
    }
    return links;
  }

  collectLinks(item, parentPath, result) {
    if (!item) return;
    
    // Create current link
    const currentPath = [...parentPath];
    if (item.id !== undefined) {
      currentPath.push(this.transformValue(item));
    }
    
    // Add link for current element if it has an id
    if (item.id !== undefined) {
      const link = this.createLinkFromPath(currentPath);
      result.push(link);
    }
    
    // Process values (inline items)
    if (item.values && Array.isArray(item.values)) {
      const values = item.values.map(v => this.transformValue(v));
      if (values.length > 0) {
        const link = this.createLinkFromPath([...currentPath, ...values]);
        result.push(link);
      }
    }
    
    // Process children (indented items)
    if (item.children && Array.isArray(item.children)) {
      for (const child of item.children) {
        this.collectLinks(child, currentPath, result);
      }
    }
  }
  
  transformValue(item) {
    if (!item) return null;
    if (typeof item === 'string') return new Link(item);
    if (item.id !== undefined) return new Link(item.id);
    return new Link(null, item.values ? item.values.map(v => this.transformValue(v)) : []);
  }
  
  createLinkFromPath(path) {
    if (path.length === 0) return new Link();
    if (path.length === 1) return path[0];
    
    // Create nested link structure
    let result = path[0];
    for (let i = 1; i < path.length; i++) {
      result = new Link(null, [result, path[i]]);
    }
    return result;
  }

  transformLink(item) {
    if (!item) return null;
    
    if (item instanceof Link) {
      return item;
    }

    const link = new Link(item.id || null, []);
    
    if (item.values && Array.isArray(item.values)) {
      link.values = item.values.map(v => this.transformLink(v));
    }
    
    if (item.children && Array.isArray(item.children)) {
      for (const child of item.children) {
        const childLink = this.transformLink(child);
        if (childLink) {
          link.values.push(childLink);
        }
      }
    }
    
    return link;
  }

  static parseSync(input) {
    let parserModule;
    try {
      parserModule = require('./parser-generated.js');
    } catch (error) {
      throw new Error('Parser grammar not compiled. Run: bun run build:grammar');
    }
    
    const parser = new Parser();
    parser.parserModule = parserModule;
    return parser.parse(input);
  }
}
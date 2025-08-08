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
    
    // Build current path
    const currentPath = [...parentPath];
    let currentLink = null;
    
    if (item.id !== undefined || item.values) {
      currentLink = this.transformLink(item);
      
      if (parentPath.length === 0) {
        // Top-level item
        if (item.children && item.children.length > 0) {
          // Has indented children - create parent link and process children
          result.push(currentLink);
          for (const child of item.children) {
            this.collectLinks(child, [currentLink], result);
          }
        } else {
          // No children - just add the link
          result.push(currentLink);
        }
      } else {
        // Child item - combine with parent path
        const combined = this.combinePathWithLink(parentPath, currentLink);
        result.push(combined);
        
        // Process any children of this item
        if (item.children && item.children.length > 0) {
          for (const child of item.children) {
            this.collectLinks(child, [combined], result);
          }
        }
      }
    }
  }
  
  combinePathWithLink(path, link) {
    if (path.length === 0) return link;
    
    // Combine all path elements with the link
    let result = path[0];
    for (let i = 1; i < path.length; i++) {
      result = new Link(null, [result, path[i]]);
    }
    
    // Add the current link to the path
    if (link.values && link.values.length > 0) {
      // If link has values, combine them
      return new Link(null, [result, ...link.values]);
    } else {
      // Just add the link itself
      return new Link(null, [result, link]);
    }
  }
  
  isParenthesizedExpression(item) {
    // Check if this came from a parenthesized expression in the grammar
    // This is a simple heuristic - parenthesized expressions don't have children
    return false; // We'll need to mark these in the grammar
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
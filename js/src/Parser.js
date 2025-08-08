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
    const items = Array.isArray(rawResult) ? rawResult : [rawResult];
    
    for (const item of items) {
      if (item) {
        this.collectLinks(item, [], links);
      }
    }
    return links;
  }

  collectLinks(item, parentPath, result) {
    if (!item) return;
    
    // For items with children (indented structure)
    if (item.children && item.children.length > 0) {
      // Add the parent item alone first
      if (item.id !== undefined) {
        if (parentPath.length === 0) {
          result.push(new Link(item.id));
        } else {
          result.push(this.combinePathElements(parentPath, new Link(item.id)));
        }
      }
      
      // Process each child with parent in the path
      const currentElement = item.id !== undefined ? new Link(item.id) : null;
      const newPath = currentElement ? [...parentPath, currentElement] : parentPath;
      
      for (const child of item.children) {
        this.collectLinks(child, newPath, result);
      }
    } else {
      // Leaf item or item with inline values
      const currentLink = this.transformLink(item);
      
      if (parentPath.length === 0) {
        result.push(currentLink);
      } else {
        result.push(this.combinePathElements(parentPath, currentLink));
      }
    }
  }
  
  combinePathElements(pathElements, current) {
    if (pathElements.length === 0) return current;
    if (pathElements.length === 1) {
      return new Link(null, [pathElements[0], current]);
    }
    
    // For multiple path elements, we need to build proper nesting
    // The last element in the path should be combined with its parent
    const parentPath = pathElements.slice(0, -1);
    const lastElement = pathElements[pathElements.length - 1];
    
    // Build the parent structure
    let parent = this.combinePathElements(parentPath, lastElement);
    
    // Add current element to the built structure
    return new Link(null, [parent, current]);
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

}
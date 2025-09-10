import { Link } from './Link.js';
import * as parserModule from './parser-generated.js';

export class Parser {
  constructor() {
  }

  parse(input) {
    try {
      const rawResult = parserModule.parse(input);
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
      // Special case: If this is an ID with empty values but has children,
      // the children should become the values of the link (indented ID syntax)
      if (item.id && (!item.values || item.values.length === 0)) {
        const childValues = item.children.map(child => {
          // For indented children, extract the actual reference from the child's values
          if (child.values && child.values.length === 1) {
            return this.transformLink(child.values[0]);
          }
          return this.transformLink(child);
        });
        const linkWithChildren = {
          id: item.id,
          values: childValues
        };
        const currentLink = this.transformLink(linkWithChildren);
        
        if (parentPath.length === 0) {
          result.push(currentLink);
        } else {
          result.push(this.combinePathElements(parentPath, currentLink));
        }
      } else {
        // Regular indented structure - process as before
        const currentLink = this.transformLink(item);
        
        // Add the link combined with parent path
        if (parentPath.length === 0) {
          result.push(currentLink);
        } else {
          result.push(this.combinePathElements(parentPath, currentLink));
        }
        
        // Process each child with this item in the path
        const newPath = [...parentPath, currentLink];
        
        for (const child of item.children) {
          this.collectLinks(child, newPath, result);
        }
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
      const combined = new Link(null, [pathElements[0], current]);
      combined._isFromPathCombination = true;
      return combined;
    }
    
    // For multiple path elements, we need to build proper nesting
    // The last element in the path should be combined with its parent
    const parentPath = pathElements.slice(0, -1);
    const lastElement = pathElements[pathElements.length - 1];
    
    // Build the parent structure
    let parent = this.combinePathElements(parentPath, lastElement);
    
    // Add current element to the built structure
    const combined = new Link(null, [parent, current]);
    combined._isFromPathCombination = true;
    return combined;
  }
  

  transformLink(item) {
    if (!item) return null;
    
    if (item instanceof Link) {
      return item;
    }

    // Handle simple reference objects like {id: 'a'}
    if (item.id !== undefined && !item.values && !item.children) {
      return new Link(item.id);
    }

    // For items with values, create a link with those values
    if (item.values && Array.isArray(item.values)) {
      // Create a link with id (if present) and transformed values
      const link = new Link(item.id || null, []);
      link.values = item.values.map(v => this.transformLink(v));
      return link;
    }
    
    // Default case
    return new Link(item.id || null, []);
  }

}
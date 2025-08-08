import { Link } from './Link.js';
import { LinksGroup } from './LinksGroup.js';

export class Parser {
  constructor() {
    this.parserModule = null;
  }

  async initialize() {
    if (!this.parserModule) {
      try {
        this.parserModule = await import('./parser.js');
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
    if (Array.isArray(rawResult)) {
      return rawResult.map(item => this.transformLink(item));
    } else if (rawResult) {
      return [this.transformLink(rawResult)];
    }
    return [];
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
      parserModule = require('./parser.js');
    } catch (error) {
      throw new Error('Parser grammar not compiled. Run: bun run build:grammar');
    }
    
    const parser = new Parser();
    parser.parserModule = parserModule;
    return parser.parse(input);
  }
}
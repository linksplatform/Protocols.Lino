'use strict';

// Links Notation Interactive Parser
class LinoParser {
    constructor() {
        this.initializePlayground();
    }

    initializePlayground() {
        const parseBtn = document.getElementById('parse-btn');
        const input = document.getElementById('input');
        const output = document.getElementById('output');

        if (parseBtn && input && output) {
            parseBtn.addEventListener('click', () => {
                this.parseInput();
            });

            input.addEventListener('input', () => {
                // Auto-parse on input change with debounce
                clearTimeout(this.parseTimeout);
                this.parseTimeout = setTimeout(() => {
                    this.parseInput();
                }, 300);
            });

            // Parse initial content
            this.parseInput();
        }
    }

    parseInput() {
        const input = document.getElementById('input');
        const output = document.getElementById('output');
        
        if (!input || !output) return;

        const text = input.value.trim();
        
        if (!text) {
            output.textContent = 'Enter some Links Notation to see the parsed result...';
            return;
        }

        try {
            // Simple parser implementation for demo purposes
            const links = this.parseLinksNotation(text);
            output.textContent = JSON.stringify(links, null, 2);
        } catch (error) {
            output.textContent = `Parse Error: ${error.message}`;
        }
    }

    parseLinksNotation(text) {
        const lines = text.split('\n').filter(line => line.trim());
        const links = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const link = this.parseLine(line, i);
            if (link) {
                links.push(link);
            }
        }
        
        return {
            type: 'links-notation',
            version: '0.6.0',
            links: links,
            totalLinks: links.length
        };
    }

    parseLine(line, index) {
        // Remove parentheses if they wrap the entire line
        const trimmed = line.trim();
        let content = trimmed;
        let isWrapped = false;
        
        if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
            content = trimmed.slice(1, -1);
            isWrapped = true;
        }
        
        // Simple parsing logic
        const parts = this.tokenize(content);
        
        return {
            id: `link_${index}`,
            original: line,
            wrapped: isWrapped,
            references: parts,
            type: this.determineType(parts)
        };
    }

    tokenize(content) {
        const tokens = [];
        let current = '';
        let inParens = 0;
        let inQuotes = false;
        
        for (let i = 0; i < content.length; i++) {
            const char = content[i];
            
            if (char === '"' && (i === 0 || content[i-1] !== '\\')) {
                inQuotes = !inQuotes;
                current += char;
            } else if (!inQuotes) {
                if (char === '(') {
                    if (current.trim()) {
                        tokens.push(this.createToken(current.trim()));
                        current = '';
                    }
                    inParens++;
                    current += char;
                } else if (char === ')') {
                    inParens--;
                    current += char;
                    if (inParens === 0 && current.trim()) {
                        tokens.push(this.createToken(current.trim()));
                        current = '';
                    }
                } else if (inParens === 0 && (char === ' ' || char === '\t')) {
                    if (current.trim()) {
                        tokens.push(this.createToken(current.trim()));
                        current = '';
                    }
                } else {
                    current += char;
                }
            } else {
                current += char;
            }
        }
        
        if (current.trim()) {
            tokens.push(this.createToken(current.trim()));
        }
        
        return tokens;
    }

    createToken(text) {
        // Detect if it's a labeled reference
        const colonIndex = text.indexOf(':');
        if (colonIndex > 0 && colonIndex < text.length - 1) {
            return {
                type: 'labeled-reference',
                label: text.substring(0, colonIndex).trim(),
                value: text.substring(colonIndex + 1).trim(),
                original: text
            };
        }
        
        // Detect nested link
        if (text.startsWith('(') && text.endsWith(')')) {
            return {
                type: 'nested-link',
                content: text.slice(1, -1),
                references: this.tokenize(text.slice(1, -1)),
                original: text
            };
        }
        
        // Simple reference
        return {
            type: 'reference',
            value: text,
            original: text
        };
    }

    determineType(references) {
        if (references.length === 0) return 'empty';
        if (references.length === 1) return 'singleton';
        if (references.length === 2) return 'doublet';
        if (references.length === 3) return 'triplet';
        return `${references.length}-tuple`;
    }
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', () => {
    // Initialize parser
    new LinoParser();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature, .example-card, .doc-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
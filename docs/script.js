'use strict';

// Links Notation Interactive Parser
class LinoParser {
    constructor() {
        this.inputElement = document.getElementById('input');
        this.outputElement = document.getElementById('output');
        this.parseBtn = document.getElementById('parse-btn');
        this.parseTimeout = null;
        this.initializePlayground();
    }

    initializePlayground() {
        if (!this.parseBtn || !this.inputElement || !this.outputElement) {
            return;
        }

        this.parseBtn.addEventListener('click', () => {
            this.parseInput();
        });

        this.inputElement.addEventListener('input', () => {
            clearTimeout(this.parseTimeout);
            this.parseTimeout = setTimeout(() => {
                this.parseInput();
            }, 300);
        });

        this.parseInput();
    }

    parseInput() {
        if (!this.inputElement || !this.outputElement) {
            return;
        }

        const text = this.inputElement.value.trim();

        if (!text) {
            this.outputElement.textContent = 'Enter some Links Notation to see the parsed result...';
            return;
        }

        try {
            const links = this.parseLinksNotation(text);
            this.outputElement.textContent = JSON.stringify(links, null, 2);
        } catch (error) {
            this.outputElement.textContent = `Parse Error: ${error.message}`;
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
            const prevChar = i > 0 ? content[i - 1] : null;

            if (this.isQuoteToggle(char, prevChar)) {
                inQuotes = !inQuotes;
                current += char;
            } else if (inQuotes) {
                current += char;
            } else {
                const result = this.processChar(char, current, inParens, tokens);
                current = result.current;
                inParens = result.inParens;
            }
        }

        this.addTokenIfValid(current, tokens);
        return tokens;
    }

    isQuoteToggle(char, prevChar) {
        return char === '"' && prevChar !== '\\';
    }

    processChar(char, current, inParens, tokens) {
        if (char === '(') {
            return this.handleOpenParen(current, inParens, tokens);
        }
        if (char === ')') {
            return this.handleCloseParen(current, inParens, tokens);
        }
        if (this.isWhitespace(char) && inParens === 0) {
            return this.handleWhitespace(current, inParens, tokens);
        }
        return { current: current + char, inParens };
    }

    handleOpenParen(current, inParens, tokens) {
        this.addTokenIfValid(current, tokens);
        return { current: '(', inParens: inParens + 1 };
    }

    handleCloseParen(current, inParens, tokens) {
        const newParens = inParens - 1;
        const newCurrent = current + ')';
        if (newParens === 0) {
            this.addTokenIfValid(newCurrent, tokens);
            return { current: '', inParens: newParens };
        }
        return { current: newCurrent, inParens: newParens };
    }

    handleWhitespace(current, inParens, tokens) {
        this.addTokenIfValid(current, tokens);
        return { current: '', inParens };
    }

    isWhitespace(char) {
        return char === ' ' || char === '\t';
    }

    addTokenIfValid(text, tokens) {
        const trimmed = text.trim();
        if (trimmed) {
            tokens.push(this.createToken(trimmed));
        }
    }

    createToken(text) {
        if (this.isLabeledReference(text)) {
            return this.createLabeledReference(text);
        }

        if (this.isNestedLink(text)) {
            return this.createNestedLink(text);
        }

        return this.createSimpleReference(text);
    }

    isLabeledReference(text) {
        const colonIndex = text.indexOf(':');
        return colonIndex > 0 && colonIndex < text.length - 1;
    }

    createLabeledReference(text) {
        const colonIndex = text.indexOf(':');
        return {
            type: 'labeled-reference',
            label: text.substring(0, colonIndex).trim(),
            value: text.substring(colonIndex + 1).trim(),
            original: text
        };
    }

    isNestedLink(text) {
        return text.startsWith('(') && text.endsWith(')');
    }

    createNestedLink(text) {
        const content = text.slice(1, -1);
        return {
            type: 'nested-link',
            content: content,
            references: this.tokenize(content),
            original: text
        };
    }

    createSimpleReference(text) {
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
#!/usr/bin/env bun

import { Parser } from '../js/src/Parser.js';
import { formatLinks } from '../js/src/Link.js';

const parser = new Parser();

console.log("Testing Arrow Syntax Implementation");
console.log("===================================");

// Test the examples from the issue
const tests = [
    "(2 ← 1)",
    "(1 → 2)", 
    "(1 2)",
    "(papa → mama)",
    "(daughter ← papa)"
];

console.log("Testing equivalence: (2 ← 1) = (1 → 2) = (1 2)");
console.log("");

for (const test of tests) {
    try {
        const result = parser.parse(test);
        const formatted = formatLinks(result);
        console.log(`Input:  ${test}`);
        console.log(`Output: ${formatted}`);
        console.log("");
    } catch (error) {
        console.log(`Error parsing "${test}": ${error.message}`);
    }
}

console.log("All tests completed!");
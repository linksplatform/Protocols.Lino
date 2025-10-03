import { Parser } from "../js/src/Parser.js";
import { formatLinks } from "../js/src/Link.js";

const parser = new Parser();

const version1 = `empInfo
  employees:
    (
      name (James Kirk)
      age 40
    )
    (
      name (Jean-Luc Picard)
      age 45
    )
    (
      name (Wesley Crusher)
      age 27
    )`;

const version2 = `empInfo
  (
    employees:
      (
        name (James Kirk)
        age 40
      )
      (
        name (Jean-Luc Picard)
        age 45
      )
      (
        name (Wesley Crusher)
        age 27
      )
  )`;

const result1 = parser.parse(version1);
const result2 = parser.parse(version2);

const formatted1 = formatLinks(result1);
const formatted2 = formatLinks(result2);

console.log("=== VERSION 1 OUTPUT ===");
console.log(formatted1);
console.log();
console.log("=== VERSION 2 OUTPUT ===");
console.log(formatted2);
console.log();
console.log("=== ARE THEY EQUAL? ===");
console.log(formatted1 === formatted2);

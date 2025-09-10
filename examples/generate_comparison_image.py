#!/usr/bin/env python3
"""
Generate a comparison image showing LiNo vs YAML vs JSON vs XML
"""

def create_ascii_comparison():
    """Create a text-based comparison image"""
    
    comparison = """
╔════════════════════════════════════════════════════════════════════════════╗
║                    Format Comparison: LiNo, YAML, JSON, XML                ║
║                      The same family data in different formats             ║
╚════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────── LiNo ──────────────────────────┬─────────────────────── YAML ──────────────────────┐
│ family: (parents: (father: John) (mother: Mary))          │ family:                                           │
│ family: (children: (son: Tom) (daughter: Alice))          │   parents:                                        │
│ (John loves Mary)                                          │     father: John                                  │
│ (Mary loves John)                                          │     mother: Mary                                  │
│ (parents love children)                                    │   children:                                       │
│ pets: (dog: Rex) (cat: Whiskers)                          │     son: Tom                                      │
│ (Rex belongs_to family)                                    │     daughter: Alice                               │
│ (Whiskers belongs_to family)                               │                                                   │
│ address: (street: "123 Main St")                           │ relationships:                                    │
│          (city: Springfield) (state: Illinois)            │   - subject: John                                 │
│                                                            │     predicate: loves                              │
│                                                            │     object: Mary                                  │
│                                                            │   - subject: Mary                                 │
│                                                            │     predicate: loves                              │
│                                                            │     object: John                                  │
│                                                            │   - subject: parents                              │
│                                                            │     predicate: love                               │
│                                                            │     object: children                              │
│                                                            │                                                   │
│                                                            │ pets:                                             │
│                                                            │   dog: Rex                                        │
│                                                            │   cat: Whiskers                                   │
│                                                            │                                                   │
│                                                            │ address:                                          │
│                                                            │   street: "123 Main St"                          │
│                                                            │   city: Springfield                               │
│                                                            │   state: Illinois                                 │
└────────────────────────────────────────────────────────────┴───────────────────────────────────────────────────┘

┌─────────────────────────── JSON ──────────────────────────┬─────────────────────── XML ───────────────────────┐
│ {                                                          │ <?xml version="1.0" encoding="UTF-8"?>           │
│   "family": {                                              │ <root>                                            │
│     "parents": {                                           │   <family>                                        │
│       "father": "John",                                    │     <parents>                                     │
│       "mother": "Mary"                                     │       <father>John</father>                      │
│     },                                                     │       <mother>Mary</mother>                      │
│     "children": {                                          │     </parents>                                    │
│       "son": "Tom",                                        │     <children>                                    │
│       "daughter": "Alice"                                  │       <son>Tom</son>                              │
│     }                                                      │       <daughter>Alice</daughter>                 │
│   },                                                       │     </children>                                   │
│   "relationships": [                                       │   </family>                                       │
│     {                                                      │                                                   │
│       "subject": "John",                                   │   <relationships>                                 │
│       "predicate": "loves",                                │     <relationship>                                │
│       "object": "Mary"                                     │       <subject>John</subject>                    │
│     },                                                     │       <predicate>loves</predicate>               │
│     {                                                      │       <object>Mary</object>                      │
│       "subject": "Mary",                                   │     </relationship>                               │
│       "predicate": "loves",                                │     <relationship>                                │
│       "object": "John"                                     │       <subject>Mary</subject>                    │
│     }                                                      │       <predicate>loves</predicate>               │
│   ],                                                       │       <object>John</object>                      │
│   "pets": {                                                │     </relationship>                               │
│     "dog": "Rex",                                          │   </relationships>                                │
│     "cat": "Whiskers"                                      │                                                   │
│   },                                                       │   <pets>                                          │
│   "address": {                                             │     <dog>Rex</dog>                                │
│     "street": "123 Main St",                               │     <cat>Whiskers</cat>                           │
│     "city": "Springfield",                                 │   </pets>                                         │
│     "state": "Illinois"                                    │                                                   │
│   }                                                        │   <address>                                       │
│ }                                                          │     <street>123 Main St</street>                 │
│                                                            │     <city>Springfield</city>                     │
│                                                            │     <state>Illinois</state>                      │
│                                                            │   </address>                                      │
│                                                            │ </root>                                           │
└────────────────────────────────────────────────────────────┴───────────────────────────────────────────────────┘

╔═══════════════════════════ LiNo Advantages ═══════════════════════════════╗
║ • Natural: Reads like human language - "John loves Mary"                   ║
║ • Concise: Most compact representation with clear relationships             ║
║ • Intuitive: Links and references are expressed naturally                  ║
║ • Flexible: Handles any number of references and nested structures         ║
║ • Universal: Can represent doublets, triplets, and N-tuples seamlessly     ║
╚═════════════════════════════════════════════════════════════════════════════╝
"""
    
    return comparison

def main():
    comparison = create_ascii_comparison()
    
    # Save to text file
    with open('/tmp/gh-issue-solver-1757491093830/examples/comparison.txt', 'w') as f:
        f.write(comparison)
    
    print("Comparison saved to comparison.txt")
    print("To create PNG: Use any tool to convert the HTML or SVG file to PNG")
    print("Example: Use a browser to open comparison.html and take a screenshot")

if __name__ == "__main__":
    main()
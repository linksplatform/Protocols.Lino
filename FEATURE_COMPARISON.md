# Feature Comparison: YAML vs XML vs JSON vs LINO

This document compares key features across different data serialization
formats, with a focus on cyclic reference support as requested in
[issue #55](https://github.com/linksplatform/Protocols.Lino/issues/55).

## Cyclic References Support

### YAML

**Support Level**: ❌ **Limited** - Anchors and aliases only

YAML supports repeated nodes through anchors (&) and aliases (*), but
has significant limitations:

- **Anchors** (&) define a value that can be referenced later
- **Aliases** (*) reference previously defined anchors
- **Limitation**: Anchors must be defined before they can be referenced
- **No True Cycles**: Cannot create A→B→A circular references directly
- **Forward References**: Not supported - aliases cannot reference
  anchors defined later

**Example**:

```yaml
# Valid: Simple reference
defaults: &defaults
  timeout: 30
  retries: 3

production:
  <<: *defaults
  host: prod.example.com

# Invalid: Cannot create true cycles
# node_a: &a
#   ref: *b  # Error: 'b' not yet defined
# node_b: &b
#   ref: *a
```

### XML

**Support Level**: ❌ **Very Limited** - Through external mechanisms only

XML itself has no built-in support for cyclic references:

- **XPointer/XPath**: Can reference other parts of documents, but
  primarily for addressing
- **IDREF/ID**: Allows references within documents, but limited scope
- **XInclude**: For including external documents, not for cycles
- **No Native Cycles**: Standard XML serialization cannot represent
  object graphs with cycles
- **External Solutions**: Some XML processors provide custom extensions

**Example**:

```xml
<!-- Limited IDREF support -->
<people>
  <person id="john" friend-ref="jane"/>
  <person id="jane" friend-ref="john"/>
</people>

<!-- But cannot serialize complex object graphs with cycles -->
```

### JSON

**Support Level**: ❌ **No Native Support**

JSON has fundamental limitations for cyclic references:

- **Tree Structure Only**: JSON represents hierarchical data, not graphs
- **Serialization Issues**: `JSON.stringify()` throws errors on cycles
- **JSON Schema**: Can define references ($ref) but for schema
  composition, not data cycles
- **JSON Pointer**: For addressing within documents, not for cycles
- **Workarounds**: External libraries provide cycle detection/replacement

**Example**:

```javascript
// This fails:
const obj = { name: "A" };
obj.self = obj; // Creates cycle
JSON.stringify(obj); // TypeError: circular structure

// JSON Schema $ref is for schema composition, not data cycles:
{
  "$ref": "#/definitions/person",  // References schema definition
  "definitions": {
    "person": { "type": "object" }
  }
}
```

### LINO (Links Notation)

**Support Level**: ✅ **Full Native Support**

LINO is specifically designed to represent linked data structures and
naturally supports cyclic references:

- **Link-Based Structure**: Every element can reference any other link by identifier
- **Bidirectional Links**: Links can reference each other freely
- **Complex Graphs**: Can represent any graph structure including cycles
- **Natural Syntax**: Cycles emerge naturally from the link reference system
- **No Special Syntax**: No additional constructs needed for cycles

**Examples**:

```lino
// Simple bidirectional relationship
john (friend: jane)
jane (friend: john)

// Complex cycle in family relationships
alice (mother: bob)
bob (son: alice, father: carol)
carol (daughter: alice, mother: bob)

// Self-reference
recursive_function (calls: recursive_function)

// Multi-level cycles in data structures
node_a (next: node_b)
node_b (next: node_c)
node_c (next: node_a, data: "cycle complete")
```

## Detailed Feature Comparison

| Feature | YAML | XML | JSON | LINO |
|---------|------|-----|------|------|
| **Cyclic References** | ❌ Limited | ❌ Very Limited | ❌ None | ✅ Full |
| **Forward References** | ❌ No | ❌ Limited | ❌ No | ✅ Yes |
| **Bidirectional Links** | ❌ No | ❌ Manual | ❌ No | ✅ Native |
| **Graph Structures** | ❌ Trees | ❌ Trees | ❌ Trees | ✅ Full Graphs |
| **Ref Syntax** | `&anchor *alias` | `id="x" ref="x"` | `$ref` | `identifier` |
| **Self-Reference** | ❌ No | ❌ Manual | ❌ No | ✅ Yes |
| **Complex Cycles** | ❌ No | ❌ No | ❌ No | ✅ Yes |
| **Serialization** | ✅ Safe | ✅ Safe | ❌ Fails on cycles | ✅ Native |

## Use Case Analysis

### When Cyclic References Matter

1. **Object-Relational Mapping**: Database entities with bidirectional relationships
2. **Graph Algorithms**: Representing networks, social graphs, dependency graphs
3. **Recursive Data Structures**: Linked lists, trees with parent pointers
4. **State Machines**: States that reference each other
5. **Document Cross-References**: Academic papers, legal documents
6. **Family Trees**: Genealogical data with marriages and relationships

### Format Recommendations

- **YAML**: Good for configuration files, simple hierarchical data
- **XML**: Good for document markup, when schema validation is important
- **JSON**: Good for web APIs, simple data exchange, when cycles aren't needed
- **LINO**: Ideal for linked data, knowledge graphs, any data with natural relationships

## Technical Implementation Notes

### YAML Limitations in Practice

```yaml
# This creates a parsing error in most YAML processors:
# parent: &parent
#   children:
#     - child: &child
#         parent: *parent  # Circular reference
```

### XML Workarounds

```xml
<!-- Requires custom processing to resolve relationships -->
<graph>
  <nodes>
    <node id="1" name="A"/>
    <node id="2" name="B"/>
  </nodes>
  <edges>
    <edge from="1" to="2"/>
    <edge from="2" to="1"/>  <!-- Creates cycle -->
  </edges>
</graph>
```

### JSON Alternatives

```javascript
// Libraries like 'circular-json' provide workarounds:
const CircularJSON = require('circular-json');
const obj = { name: "A" };
obj.self = obj;
const serialized = CircularJSON.stringify(obj);
```

### LINO Natural Cycles

```lino
// No special handling needed - cycles are natural:
parent (children: child1 child2)
child1 (parent: parent, sibling: child2)
child2 (parent: parent, sibling: child1)

// Even complex multi-level cycles work seamlessly:
company (employees: john jane)
john (employer: company, manager: jane, reports: jane)
jane (employer: company, manager: john, reports: john)
```

## Conclusion

For applications requiring cyclic references, LINO provides the most
natural and complete solution. While YAML, XML, and JSON can handle
simple hierarchical data effectively, they require workarounds or
external libraries to handle cycles, often with significant complexity
or limitations.

LINO's link-based design makes it uniquely suited for representing
interconnected data where relationships are as important as the data
itself.

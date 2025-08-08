use lino::parse_lino;

#[test]
fn test_all_features() {
    // Test single-line link with id
    let input = "id: value1 value2";
    let result = parse_lino(input);
    assert!(result.is_ok());

    // Test multi-line link with id
    let input = "(id: value1 value2)";
    let result = parse_lino(input);
    assert!(result.is_ok());

    // Test link without id (single-line)
    let input = ": value1 value2";
    let result = parse_lino(input);
    assert!(result.is_ok());

    // Test link without id (multi-line)
    let input = "(: value1 value2)";
    let result = parse_lino(input);
    assert!(result.is_ok());

    // Test point link
    let input = "(point)";
    let result = parse_lino(input);
    assert!(result.is_ok());

    // Test value link
    let input = "(value1 value2 value3)";
    let result = parse_lino(input);
    assert!(result.is_ok());

    // Test quoted references
    let input = r#"("id with spaces": "value with spaces")"#;
    let result = parse_lino(input);
    assert!(result.is_ok());

    // Test single-quoted references
    let input = "('id': 'value')";
    let result = parse_lino(input);
    assert!(result.is_ok());

    // Test nested links
    let input = "(outer: (inner: value))";
    let result = parse_lino(input);
    assert!(result.is_ok());

    // Test indentation-based children
    let input = "parent\n  child1\n  child2\n    grandchild";
    let result = parse_lino(input);
    assert!(result.is_ok());

    // Test complex indentation
    let input = r#"root
  level1a
    level2a
    level2b
  level1b
    level2c"#;
    let result = parse_lino(input);
    assert!(result.is_ok());

    // Test multiple top-level elements
    let input = "(elem1: val1)\n(elem2: val2)";
    let result = parse_lino(input);
    assert!(result.is_ok());
}

#[test]
fn test_indentation_consistency() {
    // Test that indentation must be consistent
    let input = "parent\n  child1\n   child2"; // Inconsistent indentation
    let result = parse_lino(input);
    // This should parse but child2 won't be a child of parent due to different indentation
    assert!(result.is_ok());
}

#[test]
fn test_empty_document() {
    let input = "";
    let result = parse_lino(input);
    assert!(result.is_ok());
}

#[test]
fn test_whitespace_only() {
    let input = "   \n   \n   ";
    let result = parse_lino(input);
    assert!(result.is_ok());
}

#[test]
fn test_complex_structure() {
    let input = r#"(Type: Type Type)
  Number
  String
  Array
  Value
    (property: name type)
    (method: name params return)"#;
    
    let result = parse_lino(input);
    assert!(result.is_ok());
    
    // Verify the structure was parsed correctly
    if let Ok(parsed) = result {
        // The root should be a Link with values
        assert!(parsed.is_link());
    }
}

#[test]
fn test_mixed_formats() {
    // Mix of single-line and multi-line formats
    let input = r#"id1: value1
(id2: value2 value3)
simple_ref
(complex: 
  nested1
  nested2
)"#;
    
    let result = parse_lino(input);
    assert!(result.is_ok());
}

#[test]
fn test_special_characters_in_quotes() {
    let input = r#"("key:with:colons": "value(with)parens")"#;
    let result = parse_lino(input);
    assert!(result.is_ok());
    
    let input = r#"('key with spaces': 'value: with special chars')"#;
    let result = parse_lino(input);
    assert!(result.is_ok());
}

#[test]
fn test_deeply_nested() {
    let input = "(a: (b: (c: (d: (e: value)))))";
    let result = parse_lino(input);
    assert!(result.is_ok());
}

#[test]
fn test_empty_links() {
    let input = "()";
    let result = parse_lino(input);
    assert!(result.is_ok());
    
    let input = "(:)";
    let result = parse_lino(input);
    assert!(result.is_ok());
    
    let input = "(id:)";
    let result = parse_lino(input);
    assert!(result.is_ok());
}
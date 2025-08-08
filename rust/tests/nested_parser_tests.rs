use lino::{parse_lino, LiNo};

#[test]
fn significant_whitespace_test() {
    let source = r#"
users
    user1
        id
            43
        name
            first
                John
            last
                Williams
        location
            New York
        age
            23
    user2
        id
            56
        name
            first
                Igor
            middle
                Petrovich
            last
                Ivanov
        location
            Moscow
        age
            20"#;
    
    // The expected output shows how indentation creates nested structures
    let parsed = parse_lino(source).unwrap();
    assert!(parsed.is_link());
    // Verify the structure has the expected nesting
    if let LiNo::Link { values, .. } = &parsed {
        assert!(!values.is_empty());
    }
}

#[test]
fn simple_significant_whitespace_test() {
    let source = "a\n    b\n    c";
    // This should parse as:
    // (a)
    // (a b)
    // (a c)
    let parsed = parse_lino(source).unwrap();
    assert!(parsed.is_link());
    if let LiNo::Link { values, .. } = &parsed {
        // We expect 3 links total
        assert_eq!(values.len(), 3);
    }
}

#[test]
fn two_spaces_sized_whitespace_test() {
    let source = "\nusers\n  user1";
    let parsed = parse_lino(source).unwrap();
    assert!(parsed.is_link());
    if let LiNo::Link { values, .. } = &parsed {
        // Should have 2 elements: (users) and (users user1)
        assert_eq!(values.len(), 2);
    }
}

#[test]
fn parse_nested_structure_with_indentation() {
    let input = "parent\n  child1\n  child2";
    let result = parse_lino(input).unwrap();
    assert!(result.is_link());
    if let LiNo::Link { values, .. } = &result {
        // Should create 3 links: (parent), (parent child1), (parent child2)
        assert_eq!(values.len(), 3);
    }
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
fn test_indentation_based_children() {
    // Test indentation-based children
    let input = "parent\n  child1\n  child2\n    grandchild";
    let result = parse_lino(input);
    assert!(result.is_ok());
}

#[test]
fn test_complex_indentation() {
    // Test complex indentation
    let input = r#"root
  level1a
    level2a
    level2b
  level1b
    level2c"#;
    let result = parse_lino(input);
    assert!(result.is_ok());
}
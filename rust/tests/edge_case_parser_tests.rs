use lino::{parse_lino, LiNo};

#[test]
#[ignore] // Not implemented yet, similar to C# version
fn empty_link_test() {
    let source = ":";
    let parsed = parse_lino(source).unwrap();
    // This test is skipped because it's not implemented yet
    assert!(parsed.is_link());
}

#[test]
fn empty_link_with_parentheses_test() {
    let source = "()";
    let parsed = parse_lino(source).unwrap();
    // Should parse as an empty link
    assert!(parsed.is_link());
    if let LiNo::Link { id: _, values } = &parsed {
        // The outer wrapper
        if let Some(LiNo::Link { id: inner_id, values: inner_values }) = values.first() {
            assert_eq!(*inner_id, None);
            assert!(inner_values.is_empty());
        }
    }
}

#[test]
fn empty_link_with_empty_self_reference_test() {
    let source = "(:)";
    let parsed = parse_lino(source).unwrap();
    // Should parse as empty link (: with no values becomes empty)
    assert!(parsed.is_link());
}

#[test]
fn test_all_features_test() {
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
}

#[test]
fn test_empty_document_test() {
    let input = "";
    let result = parse_lino(input);
    // Should fail like C#/JS version - empty documents are not allowed
    assert!(result.is_err());
    assert_eq!(result.unwrap_err(), "Failed to parse 'document'.");
}

#[test]
fn test_whitespace_only_test() {
    let input = "   \n   \n   ";
    let result = parse_lino(input);
    // Should fail like C#/JS version - whitespace-only documents are not allowed
    assert!(result.is_err());
    assert_eq!(result.unwrap_err(), "Failed to parse 'document'.");
}

#[test]
fn test_empty_links_test() {
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
use lino::{parse_lino, LiNo};

#[test]
fn empty_link_test() {
    let source = ":";
    // Standalone ':' is now forbidden and should return an error
    let result = parse_lino(source);
    assert!(result.is_err());
}

#[test]
fn empty_link_with_parentheses_test() {
    let source = "()";
    let parsed = parse_lino(source).unwrap();
    // Should parse as an empty link
    assert!(parsed.is_link());
    // Verify formatted output matches C#/JS
    let output = format!("{:#}", parsed);
    assert_eq!("()", output);
}

#[test]
fn empty_link_with_empty_self_reference_test() {
    let source = "(:)";
    // '(:)' is now forbidden and should return an error
    let result = parse_lino(source);
    assert!(result.is_err());
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

    // Test link without id (single-line) - now forbidden
    let input = ": value1 value2";
    let result = parse_lino(input);
    assert!(result.is_err());

    // Test link without id (multi-line) - now forbidden
    let input = "(: value1 value2)";
    let result = parse_lino(input);
    assert!(result.is_err());

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
    // Empty document should return empty result
    assert!(result.is_ok());
    let parsed = result.unwrap();
    assert!(parsed.is_link());
    if let LiNo::Link { id, values } = parsed {
        assert!(id.is_none());
        assert!(values.is_empty());
    }
}

#[test]
fn test_whitespace_only_test() {
    let input = "   \n   \n   ";
    let result = parse_lino(input);
    // Whitespace-only document should return empty result
    assert!(result.is_ok());
    let parsed = result.unwrap();
    assert!(parsed.is_link());
    if let LiNo::Link { id, values } = parsed {
        assert!(id.is_none());
        assert!(values.is_empty());
    }
}

#[test]
fn test_empty_links_test() {
    let input = "()";
    let result = parse_lino(input);
    assert!(result.is_ok());
    
    // '(:)' is now forbidden
    let input = "(:)";
    let result = parse_lino(input);
    assert!(result.is_err());
    
    let input = "(id:)";
    let result = parse_lino(input);
    assert!(result.is_ok());
}

#[test]
fn test_invalid_input() {
    let input = "(invalid";
    let result = parse_lino(input);
    assert!(result.is_err());
}
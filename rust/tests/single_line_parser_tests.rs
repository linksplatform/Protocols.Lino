use lino::{parse_lino, LiNo};

/// Helper function to format links similar to C# and JS versions
fn format_links(lino: &LiNo<String>, less_parentheses: bool) -> String {
    match lino {
        LiNo::Ref(value) => {
            if value.contains(' ') || value.contains(':') || value.contains('(') || value.contains(')') {
                format!("'{}'", value)
            } else {
                value.clone()
            }
        }
        LiNo::Link { id, values } => {
            if values.is_empty() {
                if let Some(id) = id {
                    // Escape id same as references
                    let escaped_id = format_links(&LiNo::Ref(id.clone()), false);
                    if less_parentheses { escaped_id } else { format!("({})", escaped_id) }
                } else {
                    "()".to_string()
                }
            } else {
                let formatted_values = values
                    .iter()
                    .map(|v| format_links(v, false))
                    .collect::<Vec<_>>()
                    .join(" ");
                
                if let Some(id) = id {
                    let escaped_id = format_links(&LiNo::Ref(id.clone()), false);
                    if less_parentheses && values.len() == 1 {
                        format!("{}: {}", escaped_id, formatted_values)
                    } else {
                        format!("({}: {})", escaped_id, formatted_values)
                    }
                } else {
                    if less_parentheses && values.iter().all(|v| matches!(v, LiNo::Ref(_))) {
                        // All values are references, can skip parentheses
                        formatted_values
                    } else {
                        format!("({})", formatted_values)
                    }
                }
            }
        }
    }
}

fn format_links_multiline(lino: &LiNo<String>) -> String {
    match lino {
        LiNo::Link { values, .. } if !values.is_empty() => {
            values
                .iter()
                .map(|v| format_links(v, false))
                .collect::<Vec<_>>()
                .join("\n")
        }
        _ => format_links(lino, false),
    }
}

#[test]
fn single_link_test() {
    let source = "(address: source target)";
    let parsed = parse_lino(source).unwrap();
    let target = format_links_multiline(&parsed);
    assert_eq!(source, target);
}

#[test]
fn triplet_single_link_test() {
    let source = "(papa has car)";
    let parsed = parse_lino(source).unwrap();
    let target = format_links_multiline(&parsed);
    assert_eq!(source, target);
}

#[test]
fn bug_test_1() {
    let source = "(ignore conan-center-index repository)";
    let parsed = parse_lino(source).unwrap();
    let target = format_links_multiline(&parsed);
    assert_eq!(source, target);
}

#[test]
fn quoted_references_test() {
    let source = r#"(a: 'b' "c")"#;
    let parsed = parse_lino(source).unwrap();
    // The parser should handle quoted references
    assert!(parsed.is_link());
    if let LiNo::Link { values, .. } = &parsed {
        assert_eq!(values.len(), 1);
        if let LiNo::Link { id, values } = &values[0] {
            assert_eq!(id.as_deref(), Some("a"));
            assert_eq!(values.len(), 2);
        }
    }
}

#[test]
fn quoted_references_with_spaces_test() {
    let source = r#"('a a': 'b b' "c c")"#;
    let parsed = parse_lino(source).unwrap();
    assert!(parsed.is_link());
    if let LiNo::Link { values, .. } = &parsed {
        assert_eq!(values.len(), 1);
        if let LiNo::Link { id, values } = &values[0] {
            assert_eq!(id.as_deref(), Some("a a"));
            assert_eq!(values.len(), 2);
        }
    }
}

#[test]
fn parse_simple_reference() {
    let input = "test";
    let result = parse_lino(input).unwrap();
    assert!(result.is_link());
    if let LiNo::Link { values, .. } = &result {
        assert_eq!(values.len(), 1);
        if let LiNo::Ref(id) = &values[0] {
            assert_eq!(id, "test");
        }
    }
}

#[test]
fn parse_reference_with_colon_and_values() {
    let input = "parent: child1 child2";
    let result = parse_lino(input).unwrap();
    assert!(result.is_link());
    if let LiNo::Link { values, .. } = &result {
        assert_eq!(values.len(), 1);
        if let LiNo::Link { id, values } = &values[0] {
            assert_eq!(id.as_deref(), Some("parent"));
            assert_eq!(values.len(), 2);
        }
    }
}

#[test]
fn parse_multiline_link() {
    let input = "(parent: child1 child2)";
    let result = parse_lino(input).unwrap();
    assert!(result.is_link());
    if let LiNo::Link { values, .. } = &result {
        assert_eq!(values.len(), 1);
        if let LiNo::Link { id, values } = &values[0] {
            assert_eq!(id.as_deref(), Some("parent"));
            assert_eq!(values.len(), 2);
        }
    }
}

#[test]
fn parse_quoted_references() {
    let input = r#""has space" 'has:colon'"#;
    let result = parse_lino(input).unwrap();
    let output = format_links_multiline(&result);
    assert_eq!("('has space' 'has:colon')", output);
}

#[test]
fn parse_values_only() {
    let input = ": value1 value2";
    let result = parse_lino(input).unwrap();
    assert!(result.is_link());
    if let LiNo::Link { values, .. } = &result {
        assert_eq!(values.len(), 1);
        if let LiNo::Link { id, values } = &values[0] {
            assert_eq!(id, &None);
            assert_eq!(values.len(), 2);
        }
    }
}

#[test]
fn test_single_line_link_with_id() {
    let input = "id: value1 value2";
    let result = parse_lino(input);
    assert!(result.is_ok());
}

#[test]
fn test_multi_line_link_with_id() {
    let input = "(id: value1 value2)";
    let result = parse_lino(input);
    assert!(result.is_ok());
}

#[test]
fn test_link_without_id_single_line() {
    let input = ": value1 value2";
    let result = parse_lino(input);
    assert!(result.is_ok());
}

#[test]
fn test_link_without_id_multi_line() {
    let input = "(: value1 value2)";
    let result = parse_lino(input);
    assert!(result.is_ok());
}

#[test]
fn test_point_link() {
    let input = "(point)";
    let result = parse_lino(input);
    assert!(result.is_ok());
}

#[test]
fn test_value_link() {
    let input = "(value1 value2 value3)";
    let result = parse_lino(input);
    assert!(result.is_ok());
}

#[test]
fn test_quoted_references() {
    let input = r#"("id with spaces": "value with spaces")"#;
    let result = parse_lino(input);
    assert!(result.is_ok());
}

#[test]
fn test_single_quoted_references() {
    let input = "('id': 'value')";
    let result = parse_lino(input);
    assert!(result.is_ok());
}

#[test]
fn test_nested_links() {
    let input = "(outer: (inner: value))";
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
fn test_hyphenated_identifiers() {
    let input = "(conan-center-index: repository info)";
    let result = parse_lino(input);
    assert!(result.is_ok());
}

#[test]
fn test_multiple_words_in_quotes() {
    let input = r#"("New York": city state)"#;
    let result = parse_lino(input);
    assert!(result.is_ok());
}
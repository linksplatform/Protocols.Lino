use lino::{parse_lino, LiNo};

/// Helper function to check if a reference needs quoting
fn needs_quoting(value: &str) -> bool {
    value.contains(' ') || value.contains(':') || value.contains('(') || value.contains(')') 
        || value.contains('\t') || value.contains('\n') || value.contains('\r') 
        || value.contains('"') || value.contains('\'')
}

/// Helper function to format links similar to C# and JS versions
fn format_links(lino: &LiNo<String>, less_parentheses: bool) -> String {
    match lino {
        LiNo::Ref(value) => {
            if needs_quoting(value) {
                format!("'{}'", value)
            } else {
                value.clone()
            }
        }
        LiNo::Link { id, values } => {
            if values.is_empty() {
                if let Some(id) = id {
                    // Escape id same way as references
                    let escaped_id = format_links(&LiNo::Ref(id.clone()), false);
                    if less_parentheses { escaped_id } else { format!("({})", escaped_id) }
                } else {
                    "()".to_string()
                }
            } else {
                // Check if ID or any values need quoting for multiline formatting
                let id_needs_quotes = id.as_ref().map_or(false, |i| needs_quoting(i));
                let values_need_quotes = values.iter().any(|v| {
                    match v {
                        LiNo::Ref(val) => needs_quoting(val),
                        _ => false,
                    }
                });
                let should_use_multiline = (id_needs_quotes || values_need_quotes) && values.len() > 1;
                
                if let Some(id) = id {
                    let escaped_id = format_links(&LiNo::Ref(id.clone()), false);
                    
                    if should_use_multiline {
                        // Multiline format for quoted references
                        let formatted_values = values
                            .iter()
                            .map(|v| format!("  {}", format_links(v, false)))
                            .collect::<Vec<_>>()
                            .join("\n");
                        format!("({}:\n{}\n)", escaped_id, formatted_values)
                    } else {
                        // Standard single-line format
                        let formatted_values = values
                            .iter()
                            .map(|v| format_links(v, false))
                            .collect::<Vec<_>>()
                            .join(" ");
                        
                        // Mirror JS/C#: if less_parentheses and id doesn't need parentheses, drop outer parens
                        if less_parentheses && !escaped_id.contains(' ') && !escaped_id.contains(':') && !escaped_id.contains('(') && !escaped_id.contains(')') {
                            format!("{}: {}", escaped_id, formatted_values)
                        } else {
                            format!("({}: {})", escaped_id, formatted_values)
                        }
                    }
                } else {
                    // Values-only link
                    if should_use_multiline {
                        // Multiline format for quoted references
                        let formatted_values = values
                            .iter()
                            .map(|v| format!("  {}", format_links(v, false)))
                            .collect::<Vec<_>>()
                            .join("\n");
                        format!("(\n{}\n)", formatted_values)
                    } else {
                        // Standard single-line format
                        let formatted_values = values
                            .iter()
                            .map(|v| format_links(v, false))
                            .collect::<Vec<_>>()
                            .join(" ");
                        
                        // Values-only link: in less_parentheses mode always drop outer parentheses
                        if less_parentheses { formatted_values } else { format!("({})", formatted_values) }
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

fn format_links_multiline_with_less_parentheses(lino: &LiNo<String>) -> String {
    match lino {
        LiNo::Link { values, .. } if !values.is_empty() => {
            values
                .iter()
                .map(|v| format_links(v, true))
                .collect::<Vec<_>>()
                .join("\n")
        }
        _ => format_links(lino, true),
    }
}

#[test]
fn two_links_test() {
    let source = "(first: x y)\n(second: a b)";
    let parsed = parse_lino(source).unwrap();
    let target = format_links_multiline(&parsed);
    assert_eq!(source, target);
}

#[test]
fn parse_and_stringify_test() {
    let source = "(papa (lovesMama: loves mama))\n(son lovesMama)\n(daughter lovesMama)\n(all (love mama))";
    let parsed = parse_lino(source).unwrap();
    let target = format_links_multiline(&parsed);
    assert_eq!(source, target);
}

#[test]
fn parse_and_stringify_test_2() {
    let source = "father (lovesMom: loves mom)\nson lovesMom\ndaughter lovesMom\nall (love mom)";
    let parsed = parse_lino(source).unwrap();
    let target = format_links_multiline_with_less_parentheses(&parsed);
    assert_eq!(source, target);
}

#[test]
fn parse_and_stringify_with_less_parentheses_test() {
    let source = "lovesMama: loves mama\npapa lovesMama\nson lovesMama\ndaughter lovesMama\nall (love mama)";
    let parsed = parse_lino(source).unwrap();
    let target = format_links_multiline_with_less_parentheses(&parsed);
    assert_eq!(source, target);
}

#[test]
fn duplicate_identifiers_test() {
    let source = "(a: a b)\n(a: b c)";
    let parsed = parse_lino(source).unwrap();
    let target = format_links_multiline(&parsed);
    assert_eq!(source, target);
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
fn test_multiple_top_level_elements() {
    // Test multiple top-level elements
    let input = "(elem1: val1)\n(elem2: val2)";
    let result = parse_lino(input);
    assert!(result.is_ok());
}

#[test]
fn test_multiline_with_id() {
    // Test multi-line link with id
    let input = "(id: value1 value2)";
    let result = parse_lino(input);
    assert!(result.is_ok());
}

#[test]
fn test_multiline_simple_links() {
    let input = "(1: 1 1)\n(2: 2 2)";
    let parsed = parse_lino(input).expect("Failed to parse input");

    // Validate regular formatting
    let output = parsed.to_string();
    let expected = "((1: 1 1) (2: 2 2))"; // Expected regular output
    assert_eq!(expected, output);

    // Validate alternate formatting
    let output_alternate = format!("{:#}", parsed);
    assert_eq!(input, output_alternate);
}

#[test]
fn test_indented_children() {
    let input = "parent\n  child1\n  child2";
    let parsed = parse_lino(input).expect("Failed to parse input");
    
    // The parsed structure should have parent with children
    if let LiNo::Link { values, .. } = parsed {
        assert!(!values.is_empty());
    } else {
        panic!("Expected Link with children");
    }
}
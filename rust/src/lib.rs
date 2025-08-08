pub mod parser;

use std::fmt;

#[derive(Debug, Clone)]
pub enum LiNo<T> {
    Link { id: Option<T>, values: Vec<Self> },
    Ref(T),
}

impl<T> LiNo<T> {
    pub fn is_ref(&self) -> bool {
        matches!(self, LiNo::Ref(_))
    }

    pub fn is_link(&self) -> bool {
        matches!(self, LiNo::Link { .. })
    }
}

impl<T: ToString> fmt::Display for LiNo<T> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            LiNo::Ref(value) => write!(f, "{}", value.to_string()),
            LiNo::Link { id, values } => {
                let id_str = id
                    .as_ref()
                    .map(|id| format!("{}: ", id.to_string()))
                    .unwrap_or_default();

                if f.alternate() {
                    // Format top-level as lines
                    let lines = values
                        .iter()
                        .map(|value| format!("{}{}", id_str, value))
                        .collect::<Vec<_>>()
                        .join("\n");
                    write!(f, "{}", lines)
                } else {
                    let values_str = values
                        .iter()
                        .map(|value| value.to_string())
                        .collect::<Vec<_>>()
                        .join(" ");
                    write!(f, "({}{})", id_str, values_str)
                }
            }
        }
    }
}

// Convert from parser::Link to LiNo (without flattening)
impl From<parser::Link> for LiNo<String> {
    fn from(link: parser::Link) -> Self {
        if link.values.is_empty() && link.children.is_empty() {
            if let Some(id) = link.id {
                LiNo::Ref(id)
            } else {
                LiNo::Link { id: None, values: vec![] }
            }
        } else {
            let values: Vec<LiNo<String>> = link.values.into_iter().map(|v| v.into()).collect();
            LiNo::Link { id: link.id, values }
        }
    }
}

// Helper function to flatten indented structures according to Lino spec
fn flatten_links(links: Vec<parser::Link>) -> Vec<LiNo<String>> {
    let mut result = vec![];
    
    for link in links {
        flatten_link_recursive(&link, None, &mut result);
    }
    
    result
}

fn flatten_link_recursive(link: &parser::Link, parent: Option<LiNo<String>>, result: &mut Vec<LiNo<String>>) {
    // Create the current link without children
    let current = if link.values.is_empty() {
        if let Some(id) = &link.id {
            LiNo::Ref(id.clone())
        } else {
            LiNo::Link { id: None, values: vec![] }
        }
    } else {
        let values: Vec<LiNo<String>> = link.values.iter().map(|v| {
            parser::Link {
                id: v.id.clone(),
                values: v.values.clone(),
                children: vec![]
            }.into()
        }).collect();
        LiNo::Link { id: link.id.clone(), values }
    };
    
    // Create the combined link (parent + current)
    let combined = if let Some(parent) = parent {
        LiNo::Link { 
            id: None, 
            values: vec![parent.clone(), current.clone()]
        }
    } else {
        current.clone()
    };
    
    result.push(combined.clone());
    
    // Process children
    for child in &link.children {
        flatten_link_recursive(child, Some(combined.clone()), result);
    }
}

pub fn parse_lino(document: &str) -> Result<LiNo<String>, String> {
    match parser::parse_document(document) {
        Ok((_, links)) => {
            if links.is_empty() {
                Ok(LiNo::Link { id: None, values: vec![] })
            } else {
                // Flatten the indented structure according to Lino spec
                let flattened = flatten_links(links);
                Ok(LiNo::Link { id: None, values: flattened })
            }
        }
        Err(e) => Err(format!("Parse error: {:?}", e))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_simple_link() {
        let input = "(1: 1 1)";
        let parsed = parse_lino(input).expect("Failed to parse input");

        // Validate regular formatting
        let output = parsed.to_string();
        let expected = "((1: 1 1))"; // Expected regular output
        assert_eq!(expected, output);

        // Validate alternate formatting
        let output_alternate = format!("{:#}", parsed);
        assert_eq!(input, output_alternate);
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
    fn test_link_with_source_target() {
        let input = "(index: source target)";
        let parsed = parse_lino(input).expect("Failed to parse input");

        // Validate regular formatting
        let output = parsed.to_string();
        let expected = "((index: source target))"; // Expected regular output
        assert_eq!(expected, output);

        // Validate alternate formatting
        let output_alternate = format!("{:#}", parsed);
        assert_eq!(input, output_alternate);
    }

    #[test]
    fn test_link_with_source_type_target() {
        let input = "(index: source type target)";
        let parsed = parse_lino(input).expect("Failed to parse input");

        // Validate regular formatting
        let output = parsed.to_string();
        let expected = "((index: source type target))"; // Expected regular output
        assert_eq!(expected, output);

        // Validate alternate formatting
        let output_alternate = format!("{:#}", parsed);
        assert_eq!(input, output_alternate);
    }

    #[test]
    fn test_is_ref() {
        let reference = LiNo::Ref("some_value".to_string());
        assert!(reference.is_ref());
        assert!(!reference.is_link());
    }

    #[test]
    fn test_is_link() {
        let link = LiNo::Link {
            id: Some("id".to_string()),
            values: vec![LiNo::Ref("child".to_string())],
        };
        assert!(link.is_link());
        assert!(!link.is_ref());
    }

    #[test]
    fn test_empty_link() {
        let link = LiNo::Link::<String> {
            id: None,
            values: vec![],
        };
        let output = link.to_string();
        assert_eq!(output, "()");
    }

    #[test]
    fn test_nested_links() {
        let input = "(1: (2: (3: 3)))";
        let parsed = parse_lino(input).expect("Failed to parse input");

        // Validate regular formatting
        let output = parsed.to_string();
        let expected = "((1: (2: (3: 3))))";
        assert_eq!(expected, output);

        // Validate alternate formatting
        let output_alternate = format!("{:#}", parsed);
        assert_eq!(input, output_alternate);
    }

    #[test]
    fn test_invalid_input() {
        let input = "(invalid";
        let result = parse_lino(input);
        assert!(result.is_err());
    }

    #[test]
    fn test_single_line_format() {
        let input = "id: value1 value2";
        let parsed = parse_lino(input).expect("Failed to parse input");
        
        // The parser should handle single-line format
        let output = parsed.to_string();
        assert!(output.contains("id") && output.contains("value1") && output.contains("value2"));
    }

    #[test]
    fn test_quoted_references() {
        let input = r#"("quoted id": "value with spaces")"#;
        let parsed = parse_lino(input).expect("Failed to parse input");
        
        let output = parsed.to_string();
        assert!(output.contains("quoted id") && output.contains("value with spaces"));
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
}
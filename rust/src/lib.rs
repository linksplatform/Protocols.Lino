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
                        .map(|value| {
                            // For alternate formatting, ensure standalone references are wrapped in parentheses
                            // so that flattened structures like indented blocks render as "(ref)" lines
                            match value {
                                LiNo::Ref(_) => format!("{}({})", id_str, value),
                                _ => format!("{}{}", id_str, value),
                            }
                        })
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
    // Handle empty input like C#/JS version - throw equivalent of FormatException
    if document.is_empty() {
        return Err("Failed to parse 'document'.".to_string());
    }
    
    // Handle whitespace-only input like C#/JS version
    if document.trim().is_empty() {
        return Err("Failed to parse 'document'.".to_string());
    }
    
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

